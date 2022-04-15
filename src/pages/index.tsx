import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { FiCalendar, FiUser } from 'react-icons/fi';

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

const postsList = [
  {
    title: 'Como Utilizar hooks',
    content: 'Pensando em sincronização em vez de ciclos de vida.',
    date: '15 Mar 2021',
    author: 'Joseph Oliveira',
  },
  {
    title: 'Como Utilizar hooks',
    content: 'Pensando em sincronização em vez de ciclos de vida.',
    date: '15 Mar 2021',
    author: 'Joseph Oliveira',
  },
  {
    title: 'Como Utilizar hooks',
    content: 'Pensando em sincronização em vez de ciclos de vida.',
    date: '15 Mar 2021',
    author: 'Joseph Oliveira',
  },
  {
    title: 'Como Utilizar hooks',
    content: 'Pensando em sincronização em vez de ciclos de vida.',
    date: '15 Mar 2021',
    author: 'Joseph Oliveira',
  },
];

export default function Home() {
  // TODO
  return (
    <main>
      {postsList.map(post => (
        <article>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <span>
            <time><FiCalendar size={20}/> {post.date}</time>
            <span><FiUser size={20}/> {post.author}</span>
          </span>
        </article>
      ))}
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
