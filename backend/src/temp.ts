import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { db } from "./lib/db";
import { s3 } from "./lib/s3";

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

const getFiles = async () => {
	const command = new ListBucketsCommand({});
	const result = await s3.send(command);
	console.log(JSON.stringify(result, null, 2));

}

getFiles();
