// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, ChangeEvent } from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import api from '../../services/api'
import '../../index.css'
import Modal from '../../components/Modal'

interface IClient{
  id?: number;
  idEndereco?: number;
  nome: string;
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  bairro: string;
  estado: string;
  cidade :string
}

interface IResponse {
  data: any
}

const Client: React.FC = () => {
  type typeRegister = 'Incluir' | 'Alterar' | 'Excluir' | '';
  const [clients, setClients] = useState<IClient[]>([])
  const [show, setShow] = useState<boolean>(false)
  const [type, setType] = useState<typeRegister>('')
  const [idClient, setIdClient] = useState<Number>(0)
  const [request, setRequest] = useState<IClient>({
    nome: '',
    email: '',
    telefone: '',
    logradouro: '',
    numero: '',
    bairro: '',
    estado: '',
    cidade: ''
  })

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients () {
    const response = await api.get('/clients')
    setClients(response.data)
  }

  function handlePressButton (type: typeRegister, id?: number) {
    const carryClients = clients.find((client) => {
      return client.id === id
    })
    switch (type) {
      case 'Incluir':
        setRequest({
          id: clients.length ? clients[0].id : undefined,
          nome: '',
          email: '',
          telefone: '',
          logradouro: '',
          numero: '',
          bairro: '',
          estado: 'Santa Catarina',
          cidade: 'Tijucas'
        })
        setShow(true)
        break
      case 'Alterar':
        if (carryClients) {
          setRequest(carryClients)
        } else {
          alert('Não foi possivel carregar as informações do cliente.')
        }
        setShow(true)
        break
      case 'Excluir':
        if (carryClients) {
          setRequest(carryClients)
        } else {
          alert('Não foi possivel carregar as informações do cliente.')
        }
        setShow(true)
        break
      default:

        break
    }
    setType(type)
    setIdClient(id || 0)
  }

  function updateRequest (e: ChangeEvent<HTMLInputElement>) {
    setRequest({
      ...request,
      [e.target.name]: e.target.value
    })
  }

  function validateFields () {
    var retorno = true

    if (request.nome === '') {
      alert('Preencha o campo nome corretamente')
      retorno = false
    } else if (request.email === '') {
      alert('Preencha o campo email corretamente')
      retorno = false
    } else if (request.telefone === '' || request.telefone.length > 12) {
      alert('Preencha o campo telefone corretamente')
      retorno = false
    } else if (request.logradouro === '') {
      alert('Preencha o campo logradouro corretamente')
      retorno = false
    } else if (request.numero === '') {
      alert('Preencha o campo numero corretamente')
      retorno = false
    } else if (request.bairro === '') {
      alert('Preencha o campo bairro corretamente')
      retorno = false
    } else if (request.estado === '') {
      alert('Preencha o campo estado corretamente')
      retorno = false
    } else if (request.cidade === '') {
      alert('Preencha o campo cidade corretamente')
      retorno = false
    }

    return retorno
  }

  async function handleSubmit () {
    var response = {}

    var validated = validateFields()
    if (validated) {
      const addressClientRequest = {
        idCliente: request.id,
        logradouro: request.logradouro,
        numero: request.numero,
        bairro: request.bairro,
        estado: request.estado,
        cidade: request.cidade
      }

      const clientRequest = {
        nome: request.nome,
        email: request.email,
        telefone: request.telefone
      }

      switch (type) {
        case 'Incluir':
          response = await api.post('/clients', clientRequest)
          if (response) {
            addressClientRequest.idCliente = (response as IResponse).data
            await api.post('/addressClients', addressClientRequest)
            window.location.reload(true)
          }
          break
        case 'Alterar':
          response = await api.put(`clients/${idClient}`, clientRequest)
          if (response) {
            await api.put(`addressClients/${request.idEndereco}`, addressClientRequest)
            window.location.reload(true)
          }
          break
        case 'Excluir':
          response = await api.delete(`addressClients/${request.idEndereco}`)
          if (response) {
            window.location.reload(true)
          }
          break
        default:
          break
      }
    }
  }

  return (
    <div className="container">
      <div className="title-informations">
        <h1>Clientes</h1>
        <Button className="btn btn-success pull-right" onClick={() => handlePressButton('Incluir')} >Adicionar cliente</Button>
      </div>
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Cidade</th>
            <th>Estado</th>
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
                <td>{ client.logradouro }</td>
                <td>{ client.cidade }</td>
                <td>{ client.estado }</td>
                <td>
                  <Button size={'sm'} className="btn btn-primary mr-1" onClick={() => handlePressButton('Alterar', client.id)}>Editar</Button>
                  <Button size={'sm'} className="btn btn-danger" onClick={() => handlePressButton('Excluir', client.id)}>Excluir</Button>
                </td>
              </tr>
            ))
          }

        </tbody>
      </Table>
      <Modal show={show}
        body={
          (type !== 'Excluir')
            ? <Form>
              <Form.Group>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={request.nome}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={request.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                  />
                </Form.Group>
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={request.telefone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Logradouro</Form.Label>
                <Form.Control
                  type="text"
                  name="logradouro"
                  value={request.logradouro}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="text"
                  name="numero"
                  value={request.numero}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bairro</Form.Label>
                <Form.Control
                  type="text"
                  name="bairro"
                  value={request.bairro}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  type="text"
                  name="estado"
                  value={request.estado}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  type="text"
                  name="cidade"
                  value={request.cidade}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                />
              </Form.Group>
            </Form>
            : <p>Tem certeza que deseja excluir esse cliente? Ocasionará na exclusão do seu endereço também.</p>

        }
        setShow={setShow}
        title={type}
        onSubmit={handleSubmit}
        confirmLabel={ (type !== 'Excluir') ? 'Salvar' : 'Sim'}
        cancelLabel={ (type !== 'Excluir') ? 'Cancelar' : 'Não'}
      ></Modal>

    </div>

  )
}

export default Client
