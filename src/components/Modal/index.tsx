import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface IProps{
    title: string;
    body: any;
    confirmLabel?: string;
    cancelLabel?: string;
    onSubmit: () => void;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalComponent: React.FC<IProps> = (props: IProps) => {
  const { title, body, confirmLabel, cancelLabel, onSubmit, show, setShow } = props
  const handleClose = () => setShow(false)

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {body}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onSubmit}>{confirmLabel || 'Salvar'}</Button>
        <Button variant="primary" onClick={handleClose}>{cancelLabel || 'Cancelar'} </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalComponent
