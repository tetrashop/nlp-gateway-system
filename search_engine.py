import os, glob
def search_posts(query, posts_dir="posts"):
    if not os.path.exists(posts_dir):
        return []
    results = []
    for file in glob.glob(f"{posts_dir}/*.txt") + glob.glob(f"{posts_dir}/*.md"):
        with open(file, encoding='utf-8') as f:
            content = f.read()
            if query.lower() in content.lower():
                title = os.path.basename(file)
                snippet = content[:150].replace("\n"," ") + "..."
                results.append({"title":title, "snippet":snippet})
    return results
