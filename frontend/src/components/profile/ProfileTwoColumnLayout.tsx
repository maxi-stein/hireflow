import { Grid, Divider } from '@mantine/core';
import { ReactNode } from 'react';

interface ProfileTwoColumnLayoutProps {
    leftContent: ReactNode;
    leftTitle?: string;
    rightContent: ReactNode;
    rightTitle?: string;
}

export const ProfileTwoColumnLayout = ({
    leftContent,
    leftTitle,
    rightContent,
    rightTitle,
}: ProfileTwoColumnLayoutProps) => {
    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
                {leftTitle && <Divider mb="md" label={leftTitle} labelPosition="center" />}
                {leftContent}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }} pl={{ md: 'xl' }}>
                {rightTitle && <Divider mb="md" label={rightTitle} labelPosition="center" />}
                {rightContent}
            </Grid.Col>
        </Grid>
    );
};
