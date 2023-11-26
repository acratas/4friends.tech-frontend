import {UserLookupComponent} from "./UserLookupComponent";
import {useParams} from "react-router-dom";

export const UserLookupParamsComponent = () => {
    const { identifier: address } = useParams();
    return address ? (<UserLookupComponent address={address} />) : (<span></span>)
}
