import { User, AuthToken } from "tweeter-shared";

export interface View{
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View{
    displayInfoMessage: (message: string, duration: number, bootstrapClasss?: string | undefined) => string;
    deleteMessage: (messageId: string) => void;
}

export abstract class Presenter<V extends View>{
    private _view: V;

    protected constructor(view: V){
        this._view = view;
    }
    protected get view() {
        return this._view
    }
    public async doFailureReportingOperation(operation: () => Promise<void>, operationDescription: string, finallyOperation?: () => void){
      try {
        await operation();
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to ${operationDescription} because of exception: ${error}`
        );
        if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
      // Show the error message to the user (with the actual error text)
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error.message}`
      );
    } else {
      // Handle non-Error values (like strings or null)
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of unexpected value: ${JSON.stringify(
          error
        )}`
      );
    }
      } finally {
        if (finallyOperation){
          finallyOperation();
        }
      }
    };
}