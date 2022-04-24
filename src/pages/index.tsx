import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState('');

  useEffect(() => {
    setPosts(postsPagination.results);
    setPage(postsPagination.next_page);
  }, []);

  async function handleNextPage() {
    if (!page) {
      return;
    }

    fetch(page)
      .then(res => res.json())
      .then(json => {
        const postsNextPage = posts.concat(json.results);

        setPage(json.next_page);
        setPosts(postsNextPage);
      });
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.main}>
        <div className={commonStyles.container}>
          {posts.map((post, index) => (
            <article className={styles.postSingle} key={index}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h1>{post.data.title}</h1>
                </a>
              </Link>
              <p>{post.data.subtitle}</p>
              <span className={commonStyles.postSingleDetails}>
                <time>
                  <FiCalendar size={20} />
                  {format(new Date(post.first_publication_date), 'PP', {
                    locale: ptBR,
                  })}
                </time>
                <span>
                  <FiUser size={20} /> {post.data.author}
                </span>
              </span>
            </article>
          ))}

          {page && (
            <button
              className={styles.paginationButton}
              onClick={() => handleNextPage()}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  
  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.content', 'post.author'],
      pageSize: 1,
    }
  );

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
  };
};
