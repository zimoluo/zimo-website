import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { awsBucket, awsBucketRegion } from "@/lib/constants";
import { keyId, secretKey } from "@/lib/awskey";
import { NextApiRequest, NextApiResponse } from "next";
import * as zlib from "zlib";
import { promisify } from "util";
import { fetchUserDataBySubServerSide } from "@/lib/accountServerManager";
import { getSubFromSessionToken } from "@/lib/accountServerManager";

if (!keyId) {
  throw new Error("AWS_KEY_ID is undefined!");
}

if (!secretKey) {
  throw new Error("AWS_SECRET_KEY_ZIMO_WEB is undefined!");
}

const s3 = new S3Client({
  region: awsBucketRegion,
  credentials: {
    accessKeyId: keyId,
    secretAccessKey: secretKey,
  },
});

const directory = "account/users";

const gzip = promisify(zlib.gzip);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const { sub } = req.body;
    const tokenUser = getSubFromSessionToken(req);
    if (!tokenUser) {
      throw new Error("No user is performing banning action.");
    }
    const { state: tokenUserState } = (await fetchUserDataBySubServerSide(
      tokenUser,
      ["state"]
    )) as unknown as { state: UserState };
    if (tokenUserState !== "admin") {
      throw new Error("User is not authorized to ban users.");
    }
    let newUserState: UserState = "normal";

    const {
      state: downloadedUserState,
      name,
      profilePic,
      websiteSettings,
    } = (await fetchUserDataBySubServerSide(sub, [
      "name",
      "profilePic",
      "state",
      "websiteSettings",
    ])) as unknown as UserData;
    if (downloadedUserState === "admin") {
      throw new Error(
        "The user to be banned is an admin, which cannot be banned."
      );
    }
    if (downloadedUserState === "normal") {
      newUserState = "banned";
    }

    const securedUser = {
      name,
      profilePic,
      websiteSettings,
      state: newUserState,
    };

    const result = await uploadUserToServer(securedUser, sub);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function uploadUserToServer(
  user: any,
  sub: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Convert user to JSON string and compress it using gzip
    const compressedUser = await gzip(JSON.stringify(user));

    const params = {
      Bucket: awsBucket,
      Key: `${directory}/${sub}.json`,
      Body: compressedUser, // Upload compressed user
      ContentEncoding: "gzip", // Set ContentEncoding header to indicate that the content is gzip-compressed
      ContentType: "application/json",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    return { success: true, message: "User data successfully uploaded." };
  } catch (err: any) {
    console.error(`Failed to upload user data. Error: ${err}`);
    return {
      success: false,
      message: `Failed to upload user data. Error: ${err}`,
    };
  }
}
