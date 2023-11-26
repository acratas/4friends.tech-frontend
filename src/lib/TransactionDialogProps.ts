import {User} from "./User";
import {UserItem} from "./Responses";

interface TransactionDialogProps {
    open: boolean,
    buy: boolean,
    user: User|UserItem,
    max?: number,

    onClose?: () => void,
}

export type { TransactionDialogProps }
