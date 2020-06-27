import React, { useState, useEffect } from 'react'
import { Table, Button } from 'react-bootstrap'
import api from '../../services/api'

interface IClient{
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

const Client: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([])

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients () {
    const response = await api.get('/clients')
    setClients(response.data)
  }

  return (
    <div className="container">
      <div className="title-informations">
        <h1>Clientes</h1>
        <Button className="btn btn-success pull-right">Adicionar cliente</Button>
      </div>
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            clients.map(client => (
              <tr key={ client.id }>
                <td>{ client.id } </td>
                <td>{ client.nome }</td>
                <td>{ client.email }</td>
                <td>{ client.telefone }</td>
                <td>
                  <Button size={'sm'} className="btn btn-primary mr-1">Editar</Button>
                  <Button size={'sm'} className="btn btn-danger">Excluir</Button>
                </td>
              </tr>
            ))
          }

        </tbody>
      </Table>
    </div>

  )
}

export default Client
