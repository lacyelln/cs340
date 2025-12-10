import { PostStatusRequest, PostStatusResponse, Status, User } from "tweeter-shared";
import { statusService } from "../../factories/serviceFactory";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";


export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {

const sqsClient = new SQSClient({ region: "us-east-1" });
  const userDto = request.newStatus.user;

  const user = new User(
    (userDto as any)._firstName ?? userDto.firstName,
    (userDto as any)._lastName ?? userDto.lastName,
    (userDto as any)._alias ?? userDto.alias,
    (userDto as any)._imageUrl ?? userDto.imageUrl
  );
  
 const status = Status.fromDto(request.newStatus);

  if (!status) {
    return {
      success: false,
      message: "Invalid status",
    };
  }

  console.log("Adding to story...");
  await statusService.addToStory(request.token, status);
  console.log("Added to story successfully");

  const postQueueUrl = process.env.POST_QUEUE_URL!;
  console.log("PostQueue URL:", postQueueUrl);

  const message = {
    token: request.token,
    status: request.newStatus,
    posterAlias: status?.user.alias,
  };

  console.log("Sending message to PostQueue...");
  try {
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: postQueueUrl,
        MessageBody: JSON.stringify(message),
      })
    );
    console.log("Message sent! MessageId:", result.MessageId);
  } catch (error) {
    console.error("Failed to send SQS message:", error);
    throw error;
  }

  return {
    success: true,
    message: null,
  };
};

