import { db } from "./lib/db";

const users = async () => {
  const result = await db.query.user.findMany({
    with: {
      folders: {
        with: {
          bookmarks: {
            with: {
              chunks: true,
            },
          },
        },
      },
    },
  });
  console.log(JSON.stringify(result, null, 2));
};

const folders = async () => {
  const result = await db.query.folder.findMany({
    with: {
      user: true,
      bookmarks: true,
    },
  });
  console.log(JSON.stringify(result, null, 2));
};

users();
