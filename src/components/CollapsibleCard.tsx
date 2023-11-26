import React, {useEffect, useRef, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Box, CircularProgress, LinearProgress} from "@mui/material";


// @ts-ignore
function CollapsibleCard({title, opened, children}) {
    const [isBodyVisible, setBodyVisibility] = useState(opened);
    const [canBeRendered, setCanBeRendered] = useState(opened);
    const [loading, setLoading] = useState(true);

    const contentRef = (node: any) => {
        if (node !== null) {
            setLoading(false);
            node.classList.add('loaded');
        }
    };

    useEffect(() => {
        // @ts-ignore
        if (canBeRendered && contentRef.current) {
            setLoading(false);
            // @ts-ignore
            contentRef.current.classList.add('loaded');
        }
    }, [canBeRendered]);

    useEffect(() => {
        if (isBodyVisible && !canBeRendered) {
            setCanBeRendered(true);
        }
    }, [isBodyVisible])

    const handleToggleVisibility = () => {
        setBodyVisibility(!isBodyVisible);
    };

    return (
        <Card>
            <CardHeader
                sx={{
                    p: {
                        xs: 1,
                        sm: 2,
                    }
                }}
                title={title}
                titleTypographyProps={{
                    variant: 'subtitle1'
                }}
                action={
                    <IconButton onClick={handleToggleVisibility}>
                        <ExpandMoreIcon style={{
                            transform: isBodyVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }}/>
                    </IconButton>
                }
            />
            {isBodyVisible && loading && <Box sx={{p: 4}} display="flex" flexDirection="column" alignItems="center">
              <CircularProgress disableShrink color="inherit"/>
            </Box>}
            <Collapse in={isBodyVisible}>
                <CardContent sx={{
                    px: {
                        xs: 0,
                        sm: 2,
                    },
                    py: {
                        xs: 0,
                        sm: 1,
                    }
                }}>
                    {canBeRendered && (<div>
                      <div className="content" ref={contentRef}>
                          {children}
                      </div>
                    </div>)}
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default React.memo(CollapsibleCard);
