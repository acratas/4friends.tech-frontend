import React from "react";
import {useNavigate} from "react-router-dom";
import {Button, Card, CardActions, CardContent, CardMedia, Container, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

const HoldersAreaComponent = () => {

    const navigate = useNavigate();

    return (
        <Container sx={{
            mb: 2, mt: {
                sm: 2,
                md: 4
            }
        }}>
            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <Typography variant='h2' align='center'>Holders Area</Typography>
                </Grid2>
            </Grid2>
            <Grid2 container spacing={4}>
                <Grid2 xs={12} md={6} lg={5} lgOffset={1}  >
                    <Card>
                        <CardMedia
                            sx={{ height: 140 }}
                            image="/images/recent-transactions.png"
                            title="recent transactions"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Recent transactions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Latest transactions with filtering capability.<br />
                                Whales? Newbies? Friends? 💎⚡️? - browse live whoever you want.<br />
                                <a href="https://twitter.com/alojzy20829086/status/1712239062981980486">See more...</a>
                            </Typography>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'flex-end'}}>
                            {/*<Button size="small">Share</Button>*/}
                            <Button variant='contained' size="small" onClick={() => navigate('/util/recent-transactions')}>Enter</Button>
                        </CardActions>
                    </Card>
                </Grid2>
                <Grid2 xs={12} md={6} lg={5} >
                    <Card sx={{opacity: .8}}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image="/images/chatbot.png"
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Chatroom bot
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Automatically relay messages as a reply to enhance engagement.<br />
                                Welcome new members. Say GM/GN to everyone with one click.<br />
                                The best tool to grind over FT.
                            </Typography>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'flex-end'}}>
                            {/*<Button size="small">Share</Button>*/}
                            <Button variant='contained' size="small" onClick={() => navigate('/util/chat')}>Enter</Button>
                        </CardActions>
                    </Card>
                </Grid2>
                <Grid2 xs={12} md={6} lg={5} lgOffset={1}>
                    <Card sx={{opacity: .8}}>
                        <CardMedia
                            sx={{ height: 140 }}
                            image="/images/tradingbot.png"
                            title="green iguana"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Trading bot
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create purchase and sale rules to always be profitable.<br />
                                Automate the entire process without incurring additional costs.<br />
                                <a href="https://twitter.com/alojzy20829086">🌟 Stay Tuned 🌟</a>
                            </Typography>
                        </CardContent>
                        <CardActions sx={{justifyContent: 'flex-end'}}>
                            {/*<Button size="small">Share</Button>*/}
                            <Button size="small" disabled>Soon</Button>
                        </CardActions>
                    </Card>
                </Grid2>
                {/*<Grid2 xs={12} md={6} lg={5} lgOffset={1}>*/}
                {/*    <Card>*/}
                {/*        <CardMedia*/}
                {/*            sx={{ height: 140 }}*/}
                {/*            image="https://mui.com/static/images/cards/contemplative-reptile.jpg"*/}
                {/*            title="green iguana"*/}
                {/*        />*/}
                {/*        <CardContent>*/}
                {/*            <Typography gutterBottom variant="h5" component="div">*/}
                {/*                See your Army*/}
                {/*            </Typography>*/}
                {/*            <Typography variant="body2" color="text.secondary">*/}
                {/*                Lizards are a widespread group of squamate reptiles, with over 6,000*/}
                {/*                species, ranging across all continents except Antarctica*/}
                {/*            </Typography>*/}
                {/*        </CardContent>*/}
                {/*        <CardActions>*/}
                {/*            <Button size="small">Share</Button>*/}
                {/*            <Button size="small">Learn More</Button>*/}
                {/*        </CardActions>*/}
                {/*    </Card>*/}
                {/*</Grid2>*/}
                {/*<Grid2 xs={12} md={6} lg={5}>*/}
                {/*    <Card>*/}
                {/*        <CardMedia*/}
                {/*            sx={{ height: 140 }}*/}
                {/*            image="https://mui.com/static/images/cards/contemplative-reptile.jpg"*/}
                {/*            title="green iguana"*/}
                {/*        />*/}
                {/*        <CardContent>*/}
                {/*            <Typography gutterBottom variant="h5" component="div">*/}
                {/*                See your club*/}
                {/*            </Typography>*/}
                {/*            <Typography variant="body2" color="text.secondary">*/}
                {/*                Lizards are a widespread group of squamate reptiles, with over 6,000*/}
                {/*                species, ranging across all continents except Antarctica*/}
                {/*            </Typography>*/}
                {/*        </CardContent>*/}
                {/*        <CardActions>*/}
                {/*            <Button size="small">Share</Button>*/}
                {/*            <Button size="small">Learn More</Button>*/}
                {/*        </CardActions>*/}
                {/*    </Card>*/}
                {/*</Grid2>*/}
            </Grid2>
        </Container>
    )
}

export default React.memo(HoldersAreaComponent);
