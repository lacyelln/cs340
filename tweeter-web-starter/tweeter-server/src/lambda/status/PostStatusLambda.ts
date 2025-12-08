import { PostStatusRequest, PostStatusResponse, Status, User } from "tweeter-shared";
import { statusService } from "../../factories/serviceFactory";


export const handler = async (request: PostStatusRequest): Promise<PostStatusResponse> => {

  // ✅ Correct validation:
  if (!request?.newStatus?.user) {
    console.error("BLOCKED REQUEST — missing user:", request);
    return { success: false, message: "newStatus.user was undefined or missing"};
  }

  const userDto = request.newStatus.user;

  const user = new User(
    (userDto as any)._firstName ?? userDto.firstName,
    (userDto as any)._lastName ?? userDto.lastName,
    (userDto as any)._alias ?? userDto.alias,
    (userDto as any)._imageUrl ?? userDto.imageUrl
  );
  
 if (!user) {
    return { success: false, message: "Invalid user DTO" };
  }
  await statusService.postStatus(
    request.token,
    new Status(
      request.newStatus.post,
      user!,
      request.newStatus.timestamp
    )
  );

  return {
    success: true,
    message: null
  };
};
