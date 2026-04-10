import type { IBlogRepository } from '../interfaces/IBlogRepository';
import type { BlogPost, BlogPostSummary } from '../../types';

const POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'poranne-mgly-nad-mazurami',
    title: 'Poranne mgły nad Mazurami',
    excerpt: 'Wyjazd o świcie, termos z kawą i pięć godzin czekania na odpowiednie światło. Czy było warto? Zdecydowanie.',
    coverPhotoUrl: '/photos/landscape/20251027-KMS07249.jpg',
    publishedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    blocks: [
      {
        type: 'text',
        content: `Budzik zadzwonił o 3:45. Za oknem ciemność i cisza — ten rodzaj ciszy, który zdarza się tylko późną jesienią, kiedy liście już opadły, a śnieg jeszcze nie przykrył ziemi. Wziąłem termos, sprzęt i wyjechałem przed świtem.

Mazury o tej porze roku mają w sobie coś surowego. Nie ma tu turystów ani motorówek. Tylko woda, mgła i dźwięk własnych kroków na mokrej trawie.`,
      },
      {
        type: 'photo',
        url: '/photos/landscape/20251027-KMS07249.jpg',
        caption: 'Jezioro Śniardwy, godz. 6:12. Temperatura: -2°C.',
      },
      {
        type: 'text',
        content: `Dotarłem na miejsce około 5:30. Przez pierwsze pół godziny nie było nic — tylko szara, jednolita masa mgły nad wodą. Zastanawiałem się już, czy wyjazd miał sens.

Potem, około szóstej, słońce zaczęło przebijać się przez horyzont. Mgła nie zniknęła — zamiast tego zaczęła świecić. Zmieniła kolor z szarego na złoty, potem na różowy. Miałem może kwadrans, żeby złapać to światło, zanim cały efekt się rozwieje.`,
      },
      {
        type: 'photos',
        urls: [
          '/photos/landscape/20220214-_KMS9994.jpg',
          '/photos/landscape/20221112-_KMS4056.jpg',
          '/photos/landscape/DSCF0194.jpg',
        ],
        layout: 'grid',
      },
      {
        type: 'text',
        content: `Wróciłem do auta z ponad dwustoma ujęciami. Z tej liczby wybrałem kilkanaście. Taki jest koszt fotografowania światła — musisz być gotowy długo przed tym, zanim cokolwiek się wydarzy, i działać błyskawicznie, gdy w końcu następuje ta chwila.

Czy warto wstawać o 3:45? Zawsze.`,
      },
    ],
  },
  {
    id: '2',
    slug: 'jesien-w-puszczy-bialowieskiej',
    title: 'Jesień w Puszczy Białowieskiej',
    excerpt: 'Trzy dni w najstarszym lesie Europy. Żubry, stuletnie dęby i cisza, której nie ma nigdzie indziej.',
    coverPhotoUrl: '/photos/nature/20250721-KMS02711.jpg',
    publishedAt: new Date(Date.now() - 21 * 86_400_000).toISOString(),
    blocks: [
      {
        type: 'text',
        content: `Białowieża to jedyne miejsce w Polsce, gdzie można poczuć, jak wyglądał las przed człowiekiem. Drzewa tutaj umierają ze starości i zostają na miejscu — próchnieją, dają schronienie owadom, ptakom, grzybom. To nie jest park krajobrazowy. To prawdziwy ekosystem.

Przyjechałem na trzy dni, z namiotem i bez żadnego planu. Tylko z listą miejsc, które chciałem zobaczyć.`,
      },
      {
        type: 'photo',
        url: '/photos/nature/20250427-_KMS5167.jpg',
        caption: 'Dąb liczący ponad 400 lat. Obwód pnia: 6,5 metra.',
      },
      {
        type: 'text',
        content: `Pierwszego dnia deszcz nie przestawał przez całe popołudnie. Zamiast się frustrować, postanowiłem fotografować detale — krople na liściach, mech na korze, grzyby wyrastające z powalonych pni. Las po deszczu ma własną estetykę: kolory są bardziej nasycone, powietrze czyste, a światło miękkie i równomierne.`,
      },
      {
        type: 'photos',
        urls: [
          '/photos/nature/20250427-_KMS5419.jpg',
          '/photos/nature/20250721-KMS02711.jpg',
        ],
        layout: 'grid',
      },
      {
        type: 'text',
        content: `Żubry zobaczyłem trzeciego dnia, rano, na skraju polany. Stado siedmiu sztuk — samiec, kilka samic i młode. Stałem nieruchomo przez dwadzieścia minut. Miałem teleobiektyw, ale bardziej niż zdjęcia zależało mi na tym, żeby po prostu patrzeć.

Białowieża wraca do mnie w myślach częściej niż jakiekolwiek inne miejsce, które fotografowałem. Coś tam zostało.`,
      },
    ],
  },
  {
    id: '3',
    slug: 'zima-tatry-styzen',
    title: 'Tatry w zimowej scenerii',
    excerpt: 'Styczeń w Tatrach to zupełnie inne góry. Mniej ludzi, więcej ciszy i światło, które zimą jest nie do podrobienia.',
    coverPhotoUrl: '/photos/landscape/20220214-_KMS9994.jpg',
    publishedAt: new Date(Date.now() - 45 * 86_400_000).toISOString(),
    blocks: [
      {
        type: 'text',
        content: `Tatry kojarzą się większości ludzi z latem — kolejki na Kasprowy, tłumy na Morskim Oku, zielone hale. Ale góry zimą to zupełnie inny charakter. Ścieżki są puste, schroniska pracują w ograniczonym trybie, a każdy krok wymaga skupienia.

Pojechałem w połowie stycznia, kiedy statystycznie jest największa szansa na dobrą pogodę i dobry śnieg.`,
      },
      {
        type: 'photo',
        url: '/photos/landscape/20220214-_KMS9994.jpg',
        caption: 'Widok z Przełęczy pod Kopą Kondracką, godz. 8:20.',
      },
      {
        type: 'text',
        content: `Zimowe światło w górach ma jedną cechę, której nie da się odtworzyć w żadnej innej porze roku: cienie są długie przez cały dzień. Nawet w południe słońce stoi nisko i rzeźbi każdą nierówność w śniegu. To raj dla fotografa.

Wyszedłem z Zakopanego o 5:00, żeby być na grani przed wschodem. Temperatura wynosiła -17°C. Po drodze spotkałem jedną osobę — ratownika TOPR wracającego z interwencji.`,
      },
      {
        type: 'photos',
        urls: [
          '/photos/landscape/20221112-_KMS4056.jpg',
          '/photos/landscape/DSCF0194.jpg',
        ],
        layout: 'strip',
      },
      {
        type: 'text',
        content: `Wróciłem do auta po dziesięciu godzinach. Nogi miałem martwe, palce u rąk ledwo czułem. Na karcie pamięci — trzysta klatek i kilka ujęć, z których jestem naprawdę zadowolony.

Zimowe góry uczą cierpliwości i pokory. Natura tu nie pyta o twoją wygodę.`,
      },
    ],
  },
  {
    id: '4',
    slug: 'pierwsze-kroki-z-nowym-obiektywem',
    title: 'Pierwsze kroki z nowym obiektywem',
    excerpt: 'Kupiłem używanego Nikkor 70–200mm f/2.8. Pierwszy wyjazd testowy i kilka wniosków.',
    coverPhotoUrl: '/photos/nature/20250427-_KMS5419.jpg',
    publishedAt: new Date(Date.now() - 60 * 86_400_000).toISOString(),
    blocks: [
      {
        type: 'text',
        content: `Teleobiektywy to osobna filozofia fotografowania. Komprujesz przestrzeń, zbliżasz tło, izolujesz detal. Po latach pracy głównie z szerokimi kątami, przesiadka na 70–200mm wymagała przestawienia myślenia.

Wyjechałem na pierwsze testy do lasu. Cel: portrety dzikich ptaków i detale roślinne.`,
      },
      {
        type: 'photo',
        url: '/photos/nature/20250427-_KMS5419.jpg',
        caption: 'f/2.8, 1/800s, ISO 400. Pierwsze ostre zdjęcie z nowym szkłem.',
      },
      {
        type: 'text',
        content: `Największa różnica to bokeh. Na f/2.8 tło znika w kremowym rozmyciu — temat dosłownie wyskakuje z kadru. Do tego szybki autofokus radzi sobie z poruszającymi się ptakami lepiej, niż się spodziewałem.

Wnioski po jednym dniu: obiektyw jest ciężki (1,5 kg z głowicą), ale każde zdjęcie to wynagradza.`,
      },
    ],
  },
  {
    id: '5',
    slug: 'gdansk-stare-miasto-o-swicie',
    title: 'Gdańsk — Stare Miasto o świcie',
    excerpt: 'Miasto przed przebudzeniem ma swoją własną twarz. Puste ulice, mokre kamienie i pierwsze światło.',
    coverPhotoUrl: '/photos/landscape/20221112-_KMS4056.jpg',
    publishedAt: new Date(Date.now() - 80 * 86_400_000).toISOString(),
    blocks: [
      {
        type: 'text',
        content: `Przyjechałem do Gdańska pociągiem nocnym i od razu poszedłem na Długi Targ. Było wpół do szóstej rano. Żadnych turystów, tylko jeden piekarz otwierający sklep i mewy.

Stare Miasto o tej godzinie wygląda jak scenografia przed spektaklem — wszystko gotowe, ale aktorów jeszcze nie ma.`,
      },
      {
        type: 'photos',
        urls: [
          '/photos/landscape/20221112-_KMS4056.jpg',
          '/photos/landscape/DSCF0194.jpg',
        ],
        layout: 'grid',
      },
      {
        type: 'text',
        content: `Deszcz zaczął padać około siódmej. Mokry bruk odbija światło latarni i neony kawiarni — to jeden z tych momentów, kiedy zła pogoda staje się największym sprzymierzeńcem fotografa.

Wróciłem do hostelu o dziewiątej, przemoczony, ale z kartą pełną zdjęć.`,
      },
    ],
  },
];

function toSummary(p: BlogPost): BlogPostSummary {
  const { blocks: _blocks, ...summary } = p;
  return summary;
}

export class MockBlogRepository implements IBlogRepository {
  async getAll(): Promise<BlogPostSummary[]> {
    return POSTS.map(toSummary);
  }

  async getBySlug(slug: string): Promise<BlogPost | null> {
    return POSTS.find((p) => p.slug === slug) ?? null;
  }

  async getAdjacent(slug: string): Promise<{ prev: BlogPostSummary | null; next: BlogPostSummary | null }> {
    const idx = POSTS.findIndex((p) => p.slug === slug);
    return {
      prev: idx < POSTS.length - 1 ? toSummary(POSTS[idx + 1]) : null,
      next: idx > 0 ? toSummary(POSTS[idx - 1]) : null,
    };
  }
}
