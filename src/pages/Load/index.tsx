import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import { Table, Button, Form } from 'react-bootstrap'
import { verifyStatus, formatDateToDatabase } from '../../utils/util'
import '../../index.css'
import Modal from '../../components/Modal'

interface ILoad{
    id: number;
    nomeCliente: string;
    telefoneCliente: string;
    dataEntrega: string;
    dataPrevistaEntrega: string;
    peso: number;
    largura: number;
    altura: number;
    comprimento: number;
    statusCarga: number;
}

const Load: React.FC = () => {
    type typeRegister = 'Incluir' | 'Alterar' | 'Excluir' | '';
    const [loads, setLoads] = useState<ILoad[]>([])
    const [show, setShow] = useState<boolean>(false)
    const [type, setType] = useState<typeRegister>('')

    useEffect(() => {
      loadLoads()
    }, [])

    async function loadLoads () {
      const response = await api.get('/loads')
      setLoads(response.data)
    }

    function handlePressButton (type: typeRegister) {
      setShow(true)
      setType(type)
    }

    function handleSubmit () {
      switch (type) {
        case 'Incluir':
          break
        default:
          break
      }
    }

    return (
      <div className="container">
        <div className="title-informations">
          <h1>Cargas</h1>
          <Button className="btn btn-success pull-right" onClick={() => handlePressButton('Incluir')} >Adicionar carga</Button>
        </div>
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Data Entrega</th>
              <th>Data Prevista</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {
              loads.map(load => (
                <tr key={ load.id }>
                  <td>{ load.id } </td>
                  <td>{ load.nomeCliente }</td>
                  <td>{ load.telefoneCliente }</td>
                  <td>{ formatDateToDatabase(load.dataEntrega) }</td>
                  <td>{ formatDateToDatabase(load.dataPrevistaEntrega) }</td>
                  <td>{ verifyStatus(load.statusCarga)}</td>
                  <td>
                    <Button size={'sm'} className="btn btn-primary mr-1">Editar</Button>
                    <Button size={'sm'} className="btn btn-danger">Excluir</Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        <Modal show={show}
          body={
            <Form>
              <Form.Group controlId="formGroupEmail">
                <Form.Label></Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>
              <Form.Group controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
            </Form>
          }
          setShow={setShow}
          title={type}
          onSubmit={handleSubmit}
        ></Modal>

      </div>

    )
}

export default Load
