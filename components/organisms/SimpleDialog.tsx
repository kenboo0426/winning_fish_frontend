import { Dialog, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  type?: 'transition' | 'normal';
  node: string | React.ReactNode;
  isOpen: boolean;
  color: string;
};

const SimpleDialog: React.FC<Props> = ({
  type = 'transition',
  node,
  isOpen,
  color,
}) => {
  return (
    <Dialog open={isOpen} TransitionComponent={Transition} keepMounted>
      <DialogTitle
        sx={{
          color: color,
          fontSize: 60,
          fontWeight: 900,
          mx: 5,
        }}
      >
        {node}
      </DialogTitle>
    </Dialog>
  );
};

export default SimpleDialog;
