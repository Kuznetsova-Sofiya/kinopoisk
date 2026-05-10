export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  posterUrl: string;
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Побег из Шоушенка",
    year: 1994,
    genre: "Драма",
    rating: 9.1,
    posterUrl: "https://via.placeholder.com/200x300?text=Shawshank"
  },
  {
    id: 2,
    title: "Зелёная миля",
    year: 1999,
    genre: "Драма",
    rating: 9.0,
    posterUrl: "https://via.placeholder.com/200x300?text=Green+Mile"
  },
  {
    id: 3,
    title: "Крёстный отец",
    year: 1972,
    genre: "Драма",
    rating: 9.0,
    posterUrl: "https://via.placeholder.com/200x300?text=Godfather"
  },
  {
    id: 4,
    title: "Тёмный рыцарь",
    year: 2008,
    genre: "Боевик",
    rating: 9.0,
    posterUrl: "https://via.placeholder.com/200x300?text=Dark+Knight"
  },
  {
    id: 5,
    title: "Криминальное чтиво",
    year: 1994,
    genre: "Криминал",
    rating: 8.9,
    posterUrl: "https://via.placeholder.com/200x300?text=Pulp+Fiction"
  },
  {
    id: 6,
    title: "Властелин колец: Возвращение короля",
    year: 2003,
    genre: "Фэнтези",
    rating: 8.9,
    posterUrl: "https://via.placeholder.com/200x300?text=LOTR"
  },
  {
    id: 7,
    title: "Хороший, плохой, злой",
    year: 1966,
    genre: "Вестерн",
    rating: 8.8,
    posterUrl: "https://via.placeholder.com/200x300?text=GoodBadUgly"
  },
  {
    id: 8,
    title: "Бойцовский клуб",
    year: 1999,
    genre: "Драма",
    rating: 8.8,
    posterUrl: "https://via.placeholder.com/200x300?text=Fight+Club"
  },
  {
    id: 9,
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.7,
    posterUrl: "https://via.placeholder.com/200x300?text=Interstellar"
  },
  {
    id: 10,
    title: "Начало",
    year: 2010,
    genre: "Фантастика",
    rating: 8.7,
    posterUrl: "https://via.placeholder.com/200x300?text=Inception"
  }
];