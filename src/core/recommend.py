from dataclasses import dataclass
from math import sqrt
from typing import Dict, Set


@dataclass
class Rating:
    id_: int
    user: str
    item: str
    rating: float


@dataclass
class UserItem:
    user: str
    item: str

    def __eq__(self, __o: object) -> bool:
        if __o == None: return False
        if isinstance(__o, UserItem) \
            and self.user == __o.user \
            and self.item == __o.item:
            return True

    def __hash__(self) -> int:
        hash_: int = 1
        hash_ = hash_ * 31 + hash(self.user)
        hash_ = hash_ * 31 + hash(self.item)
        return hash_


def recommend_items(
    current_user: str,
    items: Set[str],
    users: Set[str],
    grouped: Dict[UserItem, Rating]
) -> Dict[str, float]:

    """First, create a similarity matrix between users by comparing their scores"""
    user_similarity: Dict[str, float] = {}

    for user in users:
        denominatorA = 0
        denominatorB = 0
        numerator = 0

        for item in items:
            cUserItem = UserItem(user=current_user, item=item)
            userItem = UserItem(user=user, item=item)
            cRating = grouped.get(cUserItem, None)
            rating = grouped.get(userItem, None)

            if (rating != None and cRating != None):
                numerator += rating.rating * cRating.rating
                denominatorA += rating.rating * rating.rating
                denominatorB += cRating.rating * cRating.rating
            
            if numerator == 0:
                user_similarity[user] = 0
            else:
                user_similarity[user] = (numerator + 0.05) / (sqrt(denominatorA) + 0.05) / (sqrt(denominatorB) + 0.05)

    # print("-"*80)
    # print("User similarity scores")
    # print(user_similarity)
    # print("-"*80)

    recommendations: Dict[str, float] = {}

    for current_item in items:
        denominator = 0
        numerator = 0
        test: UserItem = UserItem(user=current_user, item=current_item)
        if grouped.get(test, None) != None: 
            continue
        for user in users:
            if user == current_user:
                continue
            user_item: UserItem = UserItem(user=user, item=current_item)

            rating: Rating = grouped.get(user_item, None)
            if rating != None:
                numerator += rating.rating * user_similarity.get(user)
                denominator += user_similarity.get(user)
        recommendations[current_item] = (numerator + 0.05) / (denominator + 0.05)
    
    return recommendations