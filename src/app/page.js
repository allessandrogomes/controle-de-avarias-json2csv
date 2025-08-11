'use client'

import { useEffect, useState } from "react"
import styles from "./page.module.scss"
import { Parser } from "@json2csv/plainjs"
import "normalize.css"
import Image from "next/image"
import { v4 as uuidv4 } from 'uuid'
import InputField from "@/components/InputField"
import BreakdownBox from "@/components/BreakdownBox"
import ModalConfirmDelete from "@/components/ModalConfirmDelete"
import DefaultButton from "@/components/DefaultButton"
import { IoMdDownload } from "react-icons/io"
import { MdCleaningServices } from "react-icons/md"

export default function Home() {

  const [breakdowns, setBreakdowns] = useState(() => {
    const storedData = localStorage.getItem("breakdowns") | null
    return storedData ? JSON.parse(storedData) : []
  })
  const [openModalDeleteItem, setOpenModalDeleteItem] = useState(false)
  const [openModalDeleteAll, setOpenModalDeleteAll] = useState(false)
  const [code, setCode] = useState("")
  const [desc, setDesc] = useState("")
  const [qtd, setQtd] = useState("")
  const [selectedItem, setSelectedItem] = useState()
  const opts = { delimiter: ";" }
  const parser = new Parser(opts)

  // Ao montar e/ou atualizar o estado 'breakdowns', atualiza o localstorage
  useEffect(() => {
    localStorage.setItem("breakdowns", JSON.stringify(breakdowns))
  }, [breakdowns])

  function addBreakdown(code, desc, qtd, event) {
    event.preventDefault()

    const breakdown = {
      id: uuidv4(),
      codigo: code,
      descricao: desc.toUpperCase(),
      quantidade: qtd.toUpperCase()
    }

    setBreakdowns(prevState => [...prevState, breakdown])
    setCode("")
    setDesc("")
    setQtd("")
  }

  function deleteModalAskItem(item) {
    setSelectedItem(item)
    setOpenModalDeleteItem(true)
  }

  function removeBreakdown(id) {
    const filteredBreakdowns = breakdowns.filter(item => item.id !== id)
    setBreakdowns(filteredBreakdowns)
    setOpenModalDeleteItem(false)
  }

  function downloadCsv() {
    try {
      const breakdownsWithoutId = breakdowns.map(({ id, ...rest }) => rest)
      const csv = parser.parse(breakdownsWithoutId)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', "avarias.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Erro ao gerar CSV', err)
    }
  }

  function cleanList() {
    setBreakdowns([])
    setOpenModalDeleteAll(false)
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.logo}>
          <Image
            src="/lutiner.png"
            width={800}
            height={341}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Logomarca da empresa Lutiner"
          />
        </div>

        <h1>Controle de Avarias</h1>

        <form className={styles.form} onSubmit={(event) => addBreakdown(code, desc, qtd, event)}>
          <InputField fieldName="Código" fieldType="number" onChange={(event) => setCode(event.target.value)} fieldValue={code} />
          {/* <InputField fieldName="Descrição" fieldType="text" onChange={(event) => setDesc(event.target.value)} fieldValue={desc} /> */}
          <InputField fieldName="Quantidade" fieldType="text" onChange={(event) => setQtd(event.target.value)} fieldValue={qtd} />

          <button type="submit">Adicionar</button>
        </form>

        <div className={styles.breakdowns}>
          <h2>Avarias adicionadas</h2>

          <div className={styles.breakdownsItems}>
            {breakdowns.length ?
              breakdowns.map(item => (
                <BreakdownBox
                  onCloseModal={() => deleteModalAskItem(item)}
                  code={item.codigo}
                  desc={item.descricao}
                  qtd={item.quantidade}
                  key={item.id}
                />
              )) :
              <p>Nenhuma avaria adicionada</p>
            }
          </div>

          <DefaultButton
            text="Baixar CSV"
            bgColor="#006A67"
            icon={<IoMdDownload style={{ position: "relative", top: "3px" }} />}
            disabled={!breakdowns.length}
            onClick={downloadCsv}
          />

          <DefaultButton
            text="Limpar lista"
            bgColor="#E52E31"
            icon={<MdCleaningServices style={{ position: "relative", top: "1px" }} />}
            disabled={!breakdowns.length}
            onClick={() => setOpenModalDeleteAll(true)}
          />
        </div>

        {/* Modal de confirmação será exibida ao solicitar para excluir um item. */}
        {openModalDeleteItem ?
          <ModalConfirmDelete
            actionText={`Tem certeza que deseja excluir o item <span>${selectedItem.codigo} | ${selectedItem.descricao} | ${selectedItem.quantidade}</span>?`}
            cancelBtn={() => setOpenModalDeleteItem(false)}
            confirmBtn={() => removeBreakdown(selectedItem.id)}
          /> :
          ""
        }

        {/* Modal de confirmação para limpeza de todos os itens */}
        {openModalDeleteAll ?
          <ModalConfirmDelete
            actionText="Deseja realmente excluir todos os itens?"
            cancelBtn={() => setOpenModalDeleteAll(false)}
            confirmBtn={cleanList}
          /> :
          ""
        }
      </main>

      <footer className={styles.credits}>Desenvolvido por <a href="https://github.com/allessandrogomes" target="_blank">Alessandro Gomes</a></footer>
    </>
  );
}
