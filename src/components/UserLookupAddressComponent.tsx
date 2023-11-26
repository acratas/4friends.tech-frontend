import {useAddress} from "@thirdweb-dev/react";
import {UserLookupComponent} from "./UserLookupComponent";
import {Button, ButtonGroup, Container, Paper} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import {useNavigate} from "react-router-dom";

export const UserLookupAddressComponent = () => {
    const address = useAddress() ?? 'random-holder';
    const navigate = useNavigate();
    return address ? (<UserLookupComponent address={address}/>) : (
        <Container sx={{mb: 15, mt: 4}}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <Paper sx={{p: 4}}>
                        <h4>Hello friend, please connect your wallet to fully utilize our app.</h4>
                        <p>Even without a connection, you can preview accounts by wallet address. However, to buy or
                            sell keys, a connected wallet is necessary.</p>
                        <p>
                            <strong>Here you will see the true value</strong> of your portfolio - the friend.tech (also
                            debank.com) app misrepresents the actual value of purchased keys.

                        </p>
                        <p>
                            For example, according to the app, my keys are worth <b>0.88 Ξ</b>, while I can sell them
                            for <b>0.57 Ξ</b>.
                        </p>
                        <p>
                            Why does this discrepancy exist? Because the friend.tech app doesn't account for the
                            transaction fees it charges and the decrease in price due to reduced supply.
                        </p>
                        <p>Are they aware of this? <b>Of course, they are</b>. The information presented here comes
                            directly <b>from their smart contract</b>.</p>
                        <p>Is inflating the value of keys (by <b>50%</b> in my case) fair? <b>No, it's not</b>.</p>
                        <p>Will they address this? We'll see...</p>
                        <p>All calculations are based on the friend.tech smart contract. If you have the technical
                            know-how, you can verify
                            it yourself <Button size="small" variant="outlined"
                                                href="https://basescan.org/address/0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4#code">here</Button>.
                        </p>
                        <p>All key purchase/sale transactions also operate on the friend.tech smart contract.</p>
                        <p>If you use friend.tech and want to see your portfolio here, please copy your address
                            from <Button size="small" variant="outlined"
                                         href="https://friend.tech/settings">here</Button> (right next to the avatar)
                            and paste it into the search input. Then, you'll see your portfolio, history, and
                            individuals who've purchased your keys.</p>
                        <p>If you're unsure about how to connect your friend.tech wallet, please visit <Button
                            size="small" variant="outlined" href="https://friend.tech/settings">here</Button> and click
                            on the "Export Wallet" button. Then, familiarize yourself with the contents of the "Follow
                            this guide".</p>

                    </Paper>
                </Grid2>
            </Grid2>
        </Container>
    )
}
