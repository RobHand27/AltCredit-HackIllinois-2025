import requests
import re
import argparse

def get_user_info(identifier, by_id=False):
    if by_id:
        url = f"https://www.tiktok.com/@{identifier}"
    else:
        if identifier.startswith('@'):
            identifier = identifier[1:]
        url = f"https://www.tiktok.com/@{identifier}"

    response = requests.get(url)

    if response.status_code != 200:
        return {"error": f"Failed to fetch data, status code: {response.status_code}"}

    html_content = response.text

    patterns = {
        "user_id": r'"webapp.user-detail":{"userInfo":{"user":{"id":"(\d+)"',
        "unique_id": r'"uniqueId":"(.*?)"',
        "nickname": r'"nickname":"(.*?)"',
        "followers": r'"followerCount":(\d+)',
        "following": r'"followingCount":(\d+)',
        "likes": r'"heartCount":(\d+)',
        "videos": r'"videoCount":(\d+)',
        "signature": r'"signature":"(.*?)"',
        "verified": r'"verified":(true|false)',
        "secUid": r'"secUid":"(.*?)"',
        "privateAccount": r'"privateAccount":(true|false)',
        "region": r'"region":"(.*?)"',
        "profile_pic": r'"avatarLarger":"(.*?)"',
    }

    user_data = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, html_content)
        user_data[key] = match.group(1).replace('\\u002F', '/') if match else None

    # Convert int fields
    int_fields = ["followers", "following", "likes", "videos"]
    for field in int_fields:
        if user_data[field] is not None:
            user_data[field] = int(user_data[field])

    # Convert boolean fields
    bool_fields = ["verified", "privateAccount"]
    for field in bool_fields:
        if user_data[field] is not None:
            user_data[field] = user_data[field] == "true"

    # Return as digital footprint structure
    return {
        "tiktok": {
            "username": user_data.get("unique_id"),
            "nickname": user_data.get("nickname"),
            "followers": user_data.get("followers"),
            "following": user_data.get("following"),
            "likes": user_data.get("likes"),
            "videos": user_data.get("videos"),
            "verified": user_data.get("verified"),
            "bio": user_data.get("signature"),
            "private": user_data.get("privateAccount"),
            "region": user_data.get("region"),
            "profile_picture": user_data.get("profile_pic"),
        }
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get TikTok user information")
    parser.add_argument("identifier", type=str, help="TikTok username or user ID")
    parser.add_argument("--by_id", action="store_true", help="Indicates if the provided identifier is a user ID")
    args = parser.parse_args()
    
    data = get_user_info(args.identifier, args.by_id)
    print(data)