import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { useMessageActions } from "../../toaster/MessageHooks";


interface Props {
    message: string;
    tooltip: string;
    icon: [IconPrefix, IconName]; 
    
}

const OAuth = (props: Props) => {

    const { displayInfoMessage } = useMessageActions();
    
      const handleClick = () => {
        displayInfoMessage(
          props.message,
          3000,
          undefined,
        );
      };

    return (
        <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={handleClick}
              
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`${props.tooltip}Tooltip`}>{props.tooltip}</Tooltip>}
              >
                <FontAwesomeIcon icon={props.icon} />
              </OverlayTrigger>
            </button>
    );
}

export default OAuth;



