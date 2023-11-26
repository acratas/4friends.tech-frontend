import {Card, CardContent, Container} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const SimpleCardComponent = ({children}) => {
    return (
        <Container sx={{
            mb: 2, mt: {
                sm: 2,
                md: 4
            }
        }}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <Card>
                        <CardContent>
                            {children}
                        </CardContent>
                    </Card>
                </Grid2>
            </Grid2>
        </Container>
    )
}

export default SimpleCardComponent
