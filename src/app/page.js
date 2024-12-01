'use client'

import { useState } from "react";
import styles from "./page.module.scss"
import { Parser } from "@json2csv/plainjs";
import "normalize.css";
import Image from "next/image";
import { IoMdDownload } from "react-icons/io";

export default function Home() {

  const [breakdowns, setBreakdowns] = useState([])
  const [code, setCode] = useState("")
  const [desc, setDesc] = useState("")
  const [qtd, setQtd] = useState("")
  const opts = { delimiter: ";" }
  const parser = new Parser(opts)

  function addBreakdown(code, desc, qtd, event) {
    event.preventDefault()

    const breakdown = {
      codigo: code,
      descricao: desc.toUpperCase(),
      quantidade: qtd.toUpperCase()
    }

    setBreakdowns(prevState => [...prevState, breakdown])
    setCode("")
    setDesc("")
    setQtd("")
  }

  function downloadCsv() {
    try {
      const csv = parser.parse(breakdowns)
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
          <div>
            <label>Código</label>
            <input type="number" onChange={(event) => setCode(event.target.value)} value={code} required />
          </div>
          <div>
            <label>Descrição</label>
            <input type="text" onChange={(event) => setDesc(event.target.value)} value={desc} required />
          </div>
          <div>
            <label>Quantidade</label>
            <input type="text" onChange={(event) => setQtd(event.target.value)} value={qtd} required />
          </div>

          <button type="submit">Adicionar</button>
        </form>

        <div className={styles.breakdowns}>
          <h2>Avarias adicionadas</h2>
          <div>
            {breakdowns.length ? breakdowns.map(item => <p className={styles.breakdownItem} key={item.codigo}>{item.codigo} | {item.descricao} | {item.quantidade}</p>) : <p>Nenhuma avaria adicionada</p>}
          </div>
          <button className={styles.downloadCsv} disabled={!breakdowns.length} onClick={downloadCsv}>Baixar CSV <IoMdDownload style={{ position: "relative", top: "3px" }} /></button>
        </div>
      </main>
      <footer className={styles.credits}>Desenvolvido por <a href="https://github.com/allessandrogomes" target="_blank">Alessandro Gomes</a></footer>
    </>
  );
}
