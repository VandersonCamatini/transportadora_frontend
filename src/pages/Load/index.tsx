// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, ChangeEvent } from 'react'
import api from '../../services/api'
import { Table, Button, Form } from 'react-bootstrap'
import { verifyStatus, formatDateToDatabase, formatDateToInput } from '../../utils/util'
import '../../index.css'
import Modal from '../../components/Modal'

interface ILoad{
    id?: number;
    idEndereco?: number;
    nomeCliente?: string;
    telefoneCliente?: string;
    idCliente?: number;
    dataEntrega: string;
    dataPrevistaEntrega: string;
    peso: number;
    largura: number;
    altura: number;
    comprimento: number;
    statusCarga: number;
    logradouro: string;
    numero: string;
    bairro: string;
    estado: string;
    cidade :string
}

interface IClient{
  id: number,
  nome: string,
  email: string,
  telefone: string
}

interface IResponse {
  data: any
}

const Load: React.FC = () => {
    type typeRegister = 'Incluir' | 'Alterar' | 'Excluir' | '';
    const [loads, setLoads] = useState<ILoad[]>([])
    const [clients, setClients] = useState<IClient[]>([])
    const [show, setShow] = useState<boolean>(false)
    const [type, setType] = useState<typeRegister>('')
    const [idLoad, setIdLoad] = useState<Number>(0)
    const [request, setRequest] = useState<ILoad>({
      idCliente: 0,
      dataEntrega: '',
      dataPrevistaEntrega: '',
      peso: 0,
      largura: 0,
      altura: 0,
      comprimento: 0,
      statusCarga: 2,
      logradouro: '',
      numero: '',
      bairro: '',
      estado: '',
      cidade: ''
    })

    useEffect(() => {
      loadLoads()
      loadClients()
    }, [])

    async function loadLoads () {
      const response = await api.get('/loads')
      setLoads(response.data)
    }

    async function loadClients () {
      const response = await api.get('clients')
      setClients(response.data)
    }

    function handlePressButton (type: typeRegister, id?: number) {
      const carryLoads = loads.find((load) => {
        return load.id === id
      })
      switch (type) {
        case 'Incluir':
          setRequest({
            idCliente: clients.length ? clients[0].id : undefined,
            dataEntrega: '',
            dataPrevistaEntrega: '',
            peso: 0,
            largura: 0,
            altura: 0,
            comprimento: 0,
            statusCarga: 2,
            logradouro: '',
            numero: '',
            bairro: '',
            estado: 'Santa Catarina',
            cidade: 'Tijucas'
          })
          setShow(true)
          break
        case 'Alterar':
          if (carryLoads) {
            setRequest(carryLoads)
          } else {
            alert('Não foi possivel carregar as informações da carga.')
          }
          setShow(true)
          break
        case 'Excluir':
          if (carryLoads) {
            setRequest(carryLoads)
          } else {
            alert('Não foi possivel carregar as informações da carga.')
          }
          setShow(true)
          break
        default:

          break
      }
      setType(type)
      setIdLoad(id || 0)
    }

    function updateRequest (e: ChangeEvent<HTMLInputElement>) {
      setRequest({
        ...request,
        [e.target.name]: e.target.value
      })
    }

    function validateFields () {
      var retorno = true

      if (request.idCliente === null || request.idCliente === 0) {
        alert('Selecione um cliente, se não houver nenhum, cadastre.')
        retorno = false
      }
      if (request.dataEntrega === '') {
        alert('Preencha o campo data de entrega corretamente')
        retorno = false
      } else if (request.dataPrevistaEntrega === '') {
        alert('Preencha o campo data de entrega prevista corretamente')
        retorno = false
      } else if (request.peso === 0) {
        alert('O campo peso tem que ser maior que zero.')
        retorno = false
      } else if (request.largura === 0) {
        alert('O campo largura tem que ser maior que zero.')
        retorno = false
      } else if (request.comprimento === 0) {
        alert('O campo comprimento tem que ser maior que zero.')
        retorno = false
      } else if (request.logradouro === '') {
        alert('Preencha o campo logradouro corretamente')
        retorno = false
      } else if (request.altura === 0) {
        alert('O campo altura tem que ser maior que zero.')
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
        const addressLoadRequest = {
          idCarga: request.id,
          logradouro: request.logradouro,
          numero: request.numero,
          bairro: request.bairro,
          estado: request.estado,
          cidade: request.cidade
        }

        const loadRequest = {
          idCliente: request.idCliente,
          dataEntrega: formatDateToInput(request.dataEntrega),
          dataPrevistaEntrega: formatDateToInput(request.dataPrevistaEntrega),
          peso: request.peso,
          largura: request.largura,
          altura: request.altura,
          comprimento: request.comprimento,
          statusCarga: request.statusCarga
        }

        switch (type) {
          case 'Incluir':
            response = await api.post('/loads', loadRequest)
            if (response) {
              addressLoadRequest.idCarga = (response as IResponse).data
              await api.post('/addressLoads', addressLoadRequest)
              window.location.reload(true)
            }
            break
          case 'Alterar':
            response = await api.put(`loads/${idLoad}`, loadRequest)
            if (response) {
              await api.put(`addressLoads/${request.idEndereco}`, addressLoadRequest)
              window.location.reload(true)
            }
            break
          case 'Excluir':
            response = await api.delete(`addressLoads/${request.idEndereco}`)
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
          <h1>Cargas</h1>
          <Button className="btn btn-success pull-right" onClick={() => handlePressButton('Incluir')} >Adicionar carga</Button>
        </div>
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Endereço</th>
              <th>Cidade</th>
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
                  <td>{ load.logradouro }</td>
                  <td>{ load.cidade }</td>
                  <td>{ formatDateToDatabase(load.dataEntrega) }</td>
                  <td>{ formatDateToDatabase(load.dataPrevistaEntrega) }</td>
                  <td>{ verifyStatus(load.statusCarga)}</td>
                  <td>
                    <Button size={'sm'} className="btn btn-primary mr-1" onClick={() => handlePressButton('Alterar', load.id)}>Editar</Button>
                    <Button size={'sm'} className="btn btn-danger" onClick={() => handlePressButton('Excluir', load.id)}>Excluir</Button>
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
                <Form.Label>Cliente</Form.Label>
                <Form.Control as="select" name="idCliente" onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)} >
                  {
                    clients.length
                      ? clients.map(client => (
                        <option selected={(request.idCliente === client.id)} key={client.id} value={client.id} >{client.nome + ' - ' + client.telefone}</option>
                      ))
                      : <option >Nenhum cliente cadastrado</option>
                  }
                </Form.Control>
                <Form.Group>
                  <Form.Label>Data de entrega</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataEntrega"
                    value={formatDateToInput(request.dataEntrega)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                    required={true}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Data de prevista de entrega</Form.Label>
                  <Form.Control
                    type="date"
                    name="dataPrevistaEntrega"
                    value={formatDateToInput(request.dataPrevistaEntrega)}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Peso da carga</Form.Label>
                  <Form.Control
                    type="number"
                    name="peso"
                    value={request.peso}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Largura da carga</Form.Label>
                  <Form.Control
                    type="number"
                    name="largura"
                    value={request.largura}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Altura da carga</Form.Label>
                  <Form.Control
                    type="number"
                    name="altura"
                    value={request.altura}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Comprimento da carga</Form.Label>
                  <Form.Control
                    type="number"
                    name="comprimento"
                    value={request.comprimento}
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
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" name="statusCarga" onChange={(e: ChangeEvent<HTMLInputElement>) => updateRequest(e)} >
                  <option value={0} selected={(request.statusCarga === 0)}>CANCELADA</option>
                  <option value={1} selected={(request.statusCarga === 1)}>ENTREGUE</option>
                  <option value={2} selected={(request.statusCarga === 2)}>EM PROCESSAMENTO</option>
                  <option value={3} selected={(request.statusCarga === 3)}>EM TRANSPORTE</option>
                </Form.Control>
              </Form> : <p>Tem certeza que deseja excluir essa carga?</p>
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

export default Load
