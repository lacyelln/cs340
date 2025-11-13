import "isomorphic-fetch";
import { ServerFacade } from "../src/network/ServerFacade";
import { AuthToken } from "tweeter-shared";

describe("ServerFacade integration tests", () => {
    const serverFacade = new ServerFacade();

    test("register success", async () => {
        const [user, authToken] = await serverFacade.register({
            firstName: "Pete", 
            lastName: "Davidson", 
            alias: `test.${Date.now()}`, 
            password: "spainisawesome!!", 
            userImageBytes: "", 
            imageFileExtension: "jpeg"
        });

        expect(user).toBeDefined();
        expect(user!.alias).toBeTruthy();
        expect(authToken).toBeDefined();

    })

    test("get followers success", async () => {
        const token = new AuthToken("123", Date.now());
        
        const [followers, hasMore] = await serverFacade.getMoreFollowers({         
            token: token.token,
            userAlias: "Peter",
            pageSize: 10,
            lastItem: null
        })

        expect(Array.isArray(followers)).toBe(true);
        if (followers.length > 0) {
            const followerDto = followers[0].dto;
            expect(followerDto).toHaveProperty("alias");
            expect(followerDto.alias).toBeTruthy();
        }

    expect(typeof hasMore).toBe("boolean");

    })

    test("get follower count success", async () => {
        const token = new AuthToken("123", Date.now());
        const count = await serverFacade.getFollowerCount({
            token: token.token, 
            userAlias: "lacy"
        });

        expect(typeof count).toBe("number");

    })

        test("get followee count success", async () => {
        const token = new AuthToken("123", Date.now());
        const count = await serverFacade.getFolloweeCount({
            token: token.token, 
            userAlias: "lacy"
        });

        expect(typeof count).toBe("number");

    })
})