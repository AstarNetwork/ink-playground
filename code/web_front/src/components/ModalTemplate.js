import React, { useImperativeHandle, forwardRef } from 'react';
import { Dialog, DialogContent } from '@material-ui/core';

const ModalTemplate = forwardRef(({children}, ref) => {

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useImperativeHandle(ref, () => {
    return {
      handleOpen: handleOpen,
      handleClose: handleClose,
    };
  });

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
    >
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
    
  );
})

export default ModalTemplate
