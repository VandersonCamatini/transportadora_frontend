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
        <Button className="btn btn-danger" onClick={handleClose}>{cancelLabel || 'Cancelar'} </Button>
        <Button className="btn btn-success" onClick={onSubmit}>{confirmLabel || 'Salvar'}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalComponent
