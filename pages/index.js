import React, { useState, useEffect, useRef } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home({initalLaunches}) {
  const LIMIT = 10
  const [offset, setOffset] = useState(0)
  const [page, setPage] = useState(1)
  const [launches, setLaunches] = useState(initalLaunches || [])


  async function getLaunches() {
    const client = new ApolloClient({
      uri: 'https://api.spacex.land/graphql',
      cache: new InMemoryCache()
    })
  
    const { data } = await client.query({
      query: gql`
      query GetLaunches {
        launchesPast(limit: ${LIMIT}, offset: ${offset}) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
      `
    })
    setLaunches(data.launchesPast)
  }

  
  function onBack () {
    if (offset - LIMIT >= 0) {
      setOffset(offset - LIMIT)
      setPage(page - 1)
    }
  }

  function onNext () {
    setOffset(offset + LIMIT)
    setPage(page + 1)
  }

  const isFirstRun = useRef(true);
  useEffect (() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    getLaunches()
  }, [offset])



  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SpaceX Launches
        </h1>

        <p className={styles.description}>
          A React app that fetching GraphQL Data in Next.js with Apollo GraphQL
        </p>

        <div className={styles.grid}>
          {launches.map(launch => {
            return (
              <a key={launch.id} href={launch.links.video_link} className={styles.card} target='_blank' rel='noopener noreferrer'>
                <h3>{launch.mission_name}</h3>
                <p><strong>Launch Date:</strong> {new Date(launch.launch_date_local).toLocaleDateString('en-US')}</p>
                <img src={launch.links.mission_patch} style={{maxWidth: 200, maxHeight: 200 }} alt=''></img>
              </a>
            )
          })}
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={onBack} disabled={offset === 0}>Back</button>
          Page {page}
          <button onClick={onNext}>Next</button>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href='https://www.freecodecamp.org/news/how-to-fetch-graphql-data-in-next-js-with-apollo-graphql/'
          target="_blank"
          rel="noopener noreferrer"
        >
        Following and expanding upon a freecodecamp tutorial
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql',
    cache: new InMemoryCache()
  })

  const limit = 10
  const offset = 0

  const { data } = await client.query({
    query: gql`
    query GetLaunches {
      launchesPast(limit: ${limit}, offset: ${offset}) {
        id
        mission_name
        launch_date_local
        launch_site {
          site_name_long
        }
        links {
          article_link
          video_link
          mission_patch
        }
        rocket {
          rocket_name
        }
      }
    }
    `
  })

  return {
    props: {
      initalLaunches: data.launchesPast
    }
  }
}
