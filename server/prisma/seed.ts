import { prisma } from '../src/lib/prisma';

// ─── Users ────────────────────────────────────────────────────────────────────

const USERS = [
  { id: 'user_konrad', email: 'konrad@example.com', name: 'Konrad', role: 'ADMIN'  as const },
  { id: 'user_anna',   email: 'anna@example.com',   name: 'Anna K.', role: 'FRIEND' as const },
  { id: 'user_marek',  email: 'marek@example.com',  name: 'Marek W.', role: 'FRIEND' as const },
  { id: 'user_zofia',  email: 'zofia@example.com',  name: 'Zofia R.', role: 'FRIEND' as const },
  { id: 'user_piotr',  email: 'piotr@example.com',  name: 'Piotr N.', role: 'FRIEND' as const },
  { id: 'user_ela',    email: 'ela@example.com',    name: 'Ela S.',   role: 'FRIEND' as const },
  { id: 'user_tomek',  email: 'tomek@example.com',  name: 'Tomek B.', role: 'FRIEND' as const },
];

// ─── Posts ────────────────────────────────────────────────────────────────────

const POSTS = [
  {
    id: 'post_1',
    authorId: 'user_konrad',
    photoUrl: '/photos/landscape/20251027-KMS07249.jpg',
    description: 'Poranek nad jeziorem. Wstałem o 4:30, żeby złapać to światło — i chyba było warto 🌄\n\nCzęsto myślę, że najpiękniejsze chwile są zarezerwowane dla tych, którzy są gotowi wstać wcześniej niż słońce. To zdjęcie jest tego dowodem.',
    createdAt: new Date(Date.now() - 2 * 86_400_000),
    reactions: [
      { userId: 'user_anna',  emoji: 'love' },
      { userId: 'user_marek', emoji: 'wow'  },
      { userId: 'user_zofia', emoji: 'fire' },
      { userId: 'user_piotr', emoji: 'love' },
      { userId: 'user_ela',   emoji: 'fire' },
      { userId: 'user_tomek', emoji: 'love' },
    ],
    comments: [
      { id: 'c1', authorId: 'user_anna',  body: 'To światło jest absolutnie magiczne ✨ Jak długo czekałeś?',       createdAt: new Date(Date.now() - 1.8 * 86_400_000) },
      { id: 'c2', authorId: 'user_marek', body: 'Niesamowite. To jezioro Śniardwy?',                               createdAt: new Date(Date.now() - 1.5 * 86_400_000) },
      { id: 'c3', authorId: 'user_zofia', body: '4:30 😱 Ja bym nie dała rady, ale efekt jest tego wart! 🔥',     createdAt: new Date(Date.now() - 1.2 * 86_400_000) },
      { id: 'c4', authorId: 'user_piotr', body: 'Jedna z najpiękniejszych rzeczy jakie ostatnio widziałem 💯',    createdAt: new Date(Date.now() - 0.9 * 86_400_000) },
      { id: 'c5', authorId: 'user_ela',   body: 'Wydrukujesz? Chętnie bym powiesiła na ścianie 🙏',              createdAt: new Date(Date.now() - 0.5 * 86_400_000) },
    ],
  },
  {
    id: 'post_2',
    authorId: 'user_konrad',
    photoUrl: '/photos/nature/20250721-KMS02711.jpg',
    description: 'Las po deszczu ma w sobie coś mistycznego. Powietrze pachnie ziemią i żywicą, a każda kropla na liściu wygląda jak mały diament.',
    createdAt: new Date(Date.now() - 7 * 86_400_000),
    reactions: [
      { userId: 'user_anna',  emoji: 'love' },
      { userId: 'user_marek', emoji: 'wow'  },
      { userId: 'user_zofia', emoji: 'love' },
      { userId: 'user_tomek', emoji: 'clap' },
    ],
    comments: [
      { id: 'c6', authorId: 'user_anna',  body: 'Uwielbiam te kolory 🌿',               createdAt: new Date(Date.now() - 6.5 * 86_400_000) },
      { id: 'c7', authorId: 'user_tomek', body: 'Jaki obiektyw użyłeś do tego ujęcia?', createdAt: new Date(Date.now() - 6.0 * 86_400_000) },
    ],
  },
  {
    id: 'post_3',
    authorId: 'user_konrad',
    photoUrl: '/photos/landscape/20220214-_KMS9994.jpg',
    description: 'Zimowy spacer. Cisza, biel i mróz, który szczypie w twarz — dokładnie tego potrzebowałem po tygodniu przy biurku 📷❄️',
    createdAt: new Date(Date.now() - 14 * 86_400_000),
    reactions: [
      { userId: 'user_anna',  emoji: 'love' },
      { userId: 'user_marek', emoji: 'wow'  },
      { userId: 'user_zofia', emoji: 'fire' },
      { userId: 'user_ela',   emoji: 'haha' },
    ],
    comments: [
      { id: 'c8', authorId: 'user_marek', body: 'Tatry?', createdAt: new Date(Date.now() - 13 * 86_400_000) },
    ],
  },
];

// ─── Blog Posts ───────────────────────────────────────────────────────────────

type ContentBlock =
  | { type: 'text'; content: string }
  | { type: 'photo'; url: string; caption?: string }
  | { type: 'photos'; urls: string[]; layout: 'grid' | 'strip' };

function readingTime(blocks: ContentBlock[]): number {
  const words = blocks
    .filter((b): b is Extract<ContentBlock, { type: 'text' }> => b.type === 'text')
    .reduce((acc, b) => acc + b.content.split(/\s+/).length, 0);
  return Math.max(1, Math.ceil(words / 200));
}

const BLOG_POSTS: Array<{
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverPhotoUrl: string;
  publishedAt: Date;
  blocks: ContentBlock[];
}> = [
  {
    id: 'blog_1',
    slug: 'poranne-mgly-nad-mazurami',
    title: 'Poranne mgły nad Mazurami',
    excerpt: 'Wyjazd o świcie, termos z kawą i pięć godzin czekania na odpowiednie światło. Czy było warto? Zdecydowanie.',
    coverPhotoUrl: '/photos/landscape/20251027-KMS07249.jpg',
    publishedAt: new Date(Date.now() - 3 * 86_400_000),
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
    id: 'blog_2',
    slug: 'jesien-w-puszczy-bialowieskiej',
    title: 'Jesień w Puszczy Białowieskiej',
    excerpt: 'Trzy dni w najstarszym lesie Europy. Żubry, stuletnie dęby i cisza, której nie ma nigdzie indziej.',
    coverPhotoUrl: '/photos/nature/20250721-KMS02711.jpg',
    publishedAt: new Date(Date.now() - 21 * 86_400_000),
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
    id: 'blog_3',
    slug: 'zima-tatry-styzen',
    title: 'Tatry w zimowej scenerii',
    excerpt: 'Styczeń w Tatrach to zupełnie inne góry. Mniej ludzi, więcej ciszy i światło, które zimą jest nie do podrobienia.',
    coverPhotoUrl: '/photos/landscape/20220214-_KMS9994.jpg',
    publishedAt: new Date(Date.now() - 45 * 86_400_000),
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
    id: 'blog_4',
    slug: 'pierwsze-kroki-z-nowym-obiektywem',
    title: 'Pierwsze kroki z nowym obiektywem',
    excerpt: 'Kupiłem używanego Nikkor 70–200mm f/2.8. Pierwszy wyjazd testowy i kilka wniosków.',
    coverPhotoUrl: '/photos/nature/20250427-_KMS5419.jpg',
    publishedAt: new Date(Date.now() - 60 * 86_400_000),
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
    id: 'blog_5',
    slug: 'gdansk-stare-miasto-o-swicie',
    title: 'Gdańsk — Stare Miasto o świcie',
    excerpt: 'Miasto przed przebudzeniem ma swoją własną twarz. Puste ulice, mokre kamienie i pierwsze światło.',
    coverPhotoUrl: '/photos/landscape/20221112-_KMS4056.jpg',
    publishedAt: new Date(Date.now() - 80 * 86_400_000),
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

// ─── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'cat_landscape', slug: 'landscape', name: 'Landscape', description: 'Beautiful landscape photography' },
  { id: 'cat_nature',    slug: 'nature',    name: 'Nature',    description: 'Nature and wildlife photography' },
  { id: 'cat_portrait',  slug: 'portrait',  name: 'Portrait',  description: 'Portrait photography' },
  { id: 'cat_street',    slug: 'street',    name: 'Street',    description: 'Street photography' },
];

const ALBUMS = [
  {
    id: 'alb_spring_nature',
    slug: 'spring-nature-2025',
    name: 'Spring in Nature 2025',
    description: 'A walk through forests and fields in early spring.',
    location: 'Poland',
    date: new Date('2025-04-27'),
  },
  {
    id: 'alb_landscapes',
    slug: 'landscapes-of-poland',
    name: 'Landscapes of Poland',
    description: 'Wide open skies and quiet countryside.',
    location: 'Poland',
    date: new Date('2022-02-14'),
  },
  {
    id: 'alb_best_2025',
    slug: 'best-of-2025',
    name: 'Best of 2025',
    description: 'A selection of favourite shots from the year.',
    date: new Date('2025-12-31'),
  },
];

// categoryIds and albumIds arrays demonstrate many-to-many
// DSCF0194 is tagged as both landscape and nature
const PHOTOS: Array<{
  filename: string;
  primaryCategorySlug: string;  // used for storageKey + url path
  categoryIds: string[];
  albumIds: string[];
  captureDate?: string;
}> = [
  {
    filename: '20220214-_KMS9994.jpg',
    primaryCategorySlug: 'landscape',
    categoryIds: ['cat_landscape'],
    albumIds: ['alb_landscapes'],
    captureDate: '2022-02-14',
  },
  {
    filename: '20221112-_KMS4056.jpg',
    primaryCategorySlug: 'landscape',
    categoryIds: ['cat_landscape'],
    albumIds: ['alb_landscapes'],
    captureDate: '2022-11-12',
  },
  {
    filename: '20251027-KMS07249.jpg',
    primaryCategorySlug: 'landscape',
    categoryIds: ['cat_landscape'],
    albumIds: ['alb_landscapes', 'alb_best_2025'],
    captureDate: '2025-10-27',
  },
  {
    filename: 'DSCF0194.jpg',
    primaryCategorySlug: 'landscape',
    categoryIds: ['cat_landscape', 'cat_nature'],  // tagged in both
    albumIds: ['alb_landscapes'],
  },
  {
    filename: '20250427-_KMS5167.jpg',
    primaryCategorySlug: 'nature',
    categoryIds: ['cat_nature'],
    albumIds: ['alb_spring_nature', 'alb_best_2025'],
    captureDate: '2025-04-27',
  },
  {
    filename: '20250427-_KMS5419.jpg',
    primaryCategorySlug: 'nature',
    categoryIds: ['cat_nature'],
    albumIds: ['alb_spring_nature'],
    captureDate: '2025-04-27',
  },
  {
    filename: '20250721-KMS02711.jpg',
    primaryCategorySlug: 'nature',
    categoryIds: ['cat_nature'],
    albumIds: ['alb_spring_nature', 'alb_best_2025'],
    captureDate: '2025-07-21',
  },
];

async function main() {
  console.log('Seeding users...');
  for (const u of USERS) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { name: u.name, role: u.role },
      create: u,
    });
  }

  console.log('Seeding posts...');
  for (const p of POSTS) {
    await prisma.post.upsert({
      where: { id: p.id },
      update: {},
      create: { id: p.id, authorId: p.authorId, photoUrl: p.photoUrl, description: p.description, createdAt: p.createdAt },
    });

    // Sync reactions
    await prisma.reaction.deleteMany({ where: { postId: p.id } });
    for (const r of p.reactions) {
      await prisma.reaction.create({ data: { userId: r.userId, postId: p.id, emoji: r.emoji } });
    }

    // Sync comments
    for (const c of p.comments) {
      await prisma.comment.upsert({
        where: { id: c.id },
        update: {},
        create: { id: c.id, authorId: c.authorId, postId: p.id, body: c.body, createdAt: c.createdAt },
      });
    }
  }

  console.log('Seeding blog posts...');
  for (const bp of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { id: bp.id },
      update: { title: bp.title, excerpt: bp.excerpt, coverPhotoUrl: bp.coverPhotoUrl, content: bp.blocks, readingTime: readingTime(bp.blocks) },
      create: {
        id: bp.id,
        slug: bp.slug,
        title: bp.title,
        excerpt: bp.excerpt,
        coverPhotoUrl: bp.coverPhotoUrl,
        publishedAt: bp.publishedAt,
        readingTime: readingTime(bp.blocks),
        content: bp.blocks,
      },
    });
  }

  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }

  console.log('Seeding albums...');
  for (const alb of ALBUMS) {
    await prisma.album.upsert({
      where: { slug: alb.slug },
      update: { name: alb.name, description: alb.description, location: alb.location, date: alb.date },
      create: alb,
    });
  }

  console.log('Seeding photos...');
  for (const p of PHOTOS) {
    const storageKey = `${p.primaryCategorySlug}/${p.filename}`;

    const photo = await prisma.photo.upsert({
      where: { storageKey },
      update: {},
      create: {
        filename: p.filename,
        storageKey,
        url: `/photos/${p.primaryCategorySlug}/${p.filename}`,
        title: p.filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        captureDate: p.captureDate ? new Date(p.captureDate) : null,
      },
    });

    // Sync category assignments
    await prisma.photoCategory.deleteMany({ where: { photoId: photo.id } });
    for (const categoryId of p.categoryIds) {
      await prisma.photoCategory.create({ data: { photoId: photo.id, categoryId } });
    }

    // Sync album assignments
    await prisma.albumPhoto.deleteMany({ where: { photoId: photo.id } });
    for (const [order, albumId] of p.albumIds.entries()) {
      await prisma.albumPhoto.create({ data: { photoId: photo.id, albumId, order } });
    }
  }

  console.log(`Done. ${USERS.length} users, ${POSTS.length} posts, ${BLOG_POSTS.length} blog posts, ${CATEGORIES.length} categories, ${ALBUMS.length} albums, ${PHOTOS.length} photos.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
