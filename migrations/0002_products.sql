create table if not exists products (
  id serial primary key,
  sku text not null unique,
  name text not null,
  description text not null,
  category text not null,
  price_soles numeric(10, 2) not null,
  sizes text[] not null default '{}',
  colors jsonb not null default '[]',
  images text[] not null default '{}',
  material text not null default '',
  weight_g integer,
  features text[] not null default '{}',
  specs jsonb not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_created_at_idx on products (created_at desc);

insert into products (
  sku, name, description, category, price_soles, sizes, colors, images,
  material, weight_g, features, specs, featured
) values
(
  'ATL-UNI-001',
  'Camiseta táctica Dry-Fit',
  $d$Camiseta de servicio en tejido Dry-Fit de secado rápido. Corte atlético que no estorba bajo chaleco o placa. Costuras planas en hombros y costados para reducir rozaduras en jornadas largas. Cuello redondo reforzado que no se deforma con el lavado.$d$,
  'uniformes',
  89.00,
  array['S','M','L','XL','XXL'],
  '[{"name":"Olivo","hex":"#4B5320"},{"name":"Negro","hex":"#1A1A1A"},{"name":"Coyote","hex":"#9A7B4F"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
  ],
  'Poliéster Dry-Fit 160 g/m²',
  180,
  array['Secado rápido','Anti-olor','Costuras planas','Cuello reforzado'],
  '{"Uso":"Instrucción y servicio diario","Corte":"Atlético","Cuidado":"Lavado a 30 °C"}'::jsonb,
  true
),
(
  'ATL-UNI-002',
  'Pantalón cargo Ripstop 6 bolsillos',
  $d$Pantalón de faena en ripstop polialgodón. Seis bolsillos de carga con fuelle, rodillas reforzadas y pretina con elástico interior para mantener el pantalón en su sitio con cinturón rigger. Tela que no se abre en desgarro y resiste rozadura de monte.$d$,
  'uniformes',
  189.00,
  array['S','M','L','XL','XXL','XXXL'],
  '[{"name":"Olivo","hex":"#4B5320"},{"name":"Khaki","hex":"#A3926B"},{"name":"Negro","hex":"#1A1A1A"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80'
  ],
  'Ripstop 65% poliéster / 35% algodón',
  520,
  array['6 bolsillos de carga','Rodilla reforzada','Ripstop anti-desgarro','Pretina con elástico'],
  '{"Uso":"Faena y patrulla","Cierre":"Botón y bragueta","Cuidado":"Lavado industrial suave"}'::jsonb,
  true
),
(
  'ATL-CAL-001',
  'Bota de combate 8" cuero y cordura',
  $d$Bota de caña 8 pulgadas con capellada de cuero full-grain y cordura 1000D. Suela de goma de alta tracción, plantilla amortiguada y puntera reforzada. Pensada para marcha con equipo y terreno mixto. Cremallera lateral con fuelle para calzar rápido sin perder sello.$d$,
  'calzado',
  349.00,
  array['38','39','40','41','42','43','44','45'],
  '[{"name":"Negro","hex":"#1A1A1A"},{"name":"Coyote","hex":"#9A7B4F"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1539185441755-769473a23584?auto=format&fit=crop&w=900&q=80'
  ],
  'Cuero full-grain y Cordura 1000D',
  1480,
  array['Caña 8 pulgadas','Cremallera lateral','Suela de alta tracción','Puntera reforzada'],
  '{"Altura":"8 pulgadas","Suela":"Goma vibram-style","Plantilla":"EVA extraíble"}'::jsonb,
  true
),
(
  'ATL-CHA-001',
  'Chaleco táctico MOLLE',
  $d$Chaleco portaplacas ligero con trama MOLLE en pecho, espalda y costados. Ajuste de hombros y cinchas laterales. Compatible con placas blandas o rígidas de talla estándar. Malla interior para ventilación. Pensado para instrucción, seguridad y servicio, no como disfraz.$d$,
  'chalecos',
  279.00,
  array['S','M','L','XL','XXL'],
  '[{"name":"Negro","hex":"#1A1A1A"},{"name":"Olivo","hex":"#4B5320"},{"name":"Coyote","hex":"#9A7B4F"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1544022613-e87caecea06c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80'
  ],
  'Nylon 500D con malla 3D',
  890,
  array['Trama MOLLE completa','Ajuste de hombros y costado','Compatible con placa estándar','Malla interior ventilada'],
  '{"Placas":"SAPI / ESAPI talla M-L","Peso vacío":"890 g","Cierre":"Cinchas laterales"}'::jsonb,
  true
),
(
  'ATL-MOC-001',
  'Mochila de asalto 40 L',
  $d$Mochila de 40 litros con compartimento principal de boca amplia, bolsillo de hidratación, correas de compresión y panel MOLLE frontal. Espalda acolchada con canal de aire. Cinturón lumbar desmontable. Sirve para salida de 24–48 h o transporte de equipo de instrucción.$d$,
  'mochilas',
  229.00,
  array['Única'],
  '[{"name":"Olivo","hex":"#4B5320"},{"name":"Negro","hex":"#1A1A1A"},{"name":"Coyote","hex":"#9A7B4F"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80'
  ],
  'Nylon 600D ripstop',
  1100,
  array['40 litros','Panel MOLLE','Hidratación 3 L','Cinturón lumbar desmontable'],
  '{"Capacidad":"40 L","Hidratación":"Funda para vejiga 3 L","Dimensiones":"54 × 32 × 22 cm"}'::jsonb,
  false
),
(
  'ATL-ACC-001',
  'Gorra operator con velcro',
  $d$Gorra de perfil bajo con visera curva, ajuste de velcro posterior y panel de velcro frontal para parche. Tejido ripstop ligero, interior con cinta anti-sudor. No deforma con el sol ni el lavado a mano.$d$,
  'accesorios',
  45.00,
  array['S/M','L/XL'],
  '[{"name":"Negro","hex":"#1A1A1A"},{"name":"Olivo","hex":"#4B5320"},{"name":"Arena","hex":"#C2A878"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80'
  ],
  'Ripstop poliéster',
  85,
  array['Panel velcro para parche','Ajuste posterior','Cinta anti-sudor','Perfil bajo'],
  '{"Perfil":"Bajo","Visera":"Curva","Parche":"Velcro 8 × 5 cm"}'::jsonb,
  false
),
(
  'ATL-ABR-001',
  'Chaqueta softshell cortaviento',
  $d$Softshell de tres capas: exterior elástico cortaviento, membrana transpirable y interior de micropolar. Capucha ajustable que entra bajo casco, axilas con cremallera de ventilación y bolsillos altos para usar con chaleco. Ideal para frío seco de sierra y viento en costa.$d$,
  'abrigos',
  259.00,
  array['S','M','L','XL','XXL'],
  '[{"name":"Negro","hex":"#1A1A1A"},{"name":"Olivo","hex":"#4B5320"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1544022613-e87caecea06c?auto=format&fit=crop&w=900&q=80'
  ],
  'Softshell 3 capas, membrana TPU',
  640,
  array['Cortaviento','Capucha bajo casco','Cremalleras de axila','Bolsillos altos'],
  '{"Clima":"Frío seco y viento","Capucha":"Ajustable, casco-compatible","Cuidado":"No usar suavizante"}'::jsonb,
  true
),
(
  'ATL-ACC-002',
  'Guantes tácticos con nudillo',
  $d$Guantes de dedo completo con palma de cuero sintético antideslizante, nudillos termoplásticos y dorso transpirable. Dedo índice y pulgar táctiles para pantalla. Muñeca con velcro. Protección sin perder destreza para arma, volante o herramientas.$d$,
  'accesorios',
  69.00,
  array['S','M','L','XL'],
  '[{"name":"Negro","hex":"#1A1A1A"},{"name":"Olivo","hex":"#4B5320"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1588345921523-c2dcd7f38b0d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80'
  ],
  'Piel sintética, spandex y TPR',
  120,
  array['Nudillo rígido','Palma antideslizante','Punta táctil','Cierre de velcro'],
  '{"Dedos":"Completos","Pantalla":"Índice y pulgar táctiles","Par":"Incluye ambos"}'::jsonb,
  false
),
(
  'ATL-ACC-003',
  'Cinturón rigger 45 mm',
  $d$Cinturón de 45 mm en nylon de alta densidad con hebilla de doble barra. No tiene agujeros: se ajusta al milímetro y no afloja con el peso del equipo. Compatible con fundas y portaequipo de cintura. Largo recortable.$d$,
  'accesorios',
  55.00,
  array['Única'],
  '[{"name":"Negro","hex":"#1A1A1A"},{"name":"Coyote","hex":"#9A7B4F"},{"name":"Olivo","hex":"#4B5320"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80'
  ],
  'Nylon 45 mm, hebilla acetal',
  160,
  array['Ancho 45 mm','Ajuste continuo','Hebilla de doble barra','Largo recortable'],
  '{"Ancho":"45 mm","Largo":"Hasta 125 cm, recortable","Hebilla":"Acetal de doble barra"}'::jsonb,
  false
),
(
  'ATL-ABR-002',
  'Poncho impermeable 3 en 1',
  $d$Poncho de nylon recubierto que cubre al usuario con mochila puesta. Se convierte en toldo ligero con las ojetes de esquina y, plegado, en capa de suelo. Costuras termoselladas. No es traje de lluvia de ciudad: está cortado para servicio a campo.$d$,
  'abrigos',
  119.00,
  array['Única'],
  '[{"name":"Olivo","hex":"#4B5320"},{"name":"Negro","hex":"#1A1A1A"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=80'
  ],
  'Nylon 210T recubierto PU',
  380,
  array['Impermeable','Cubre mochila','Ojetes para toldo','Costuras termoselladas'],
  '{"Modos":"Poncho, toldo, suelo","Índice agua":"3000 mm","Empaque":"Bolsa incluida"}'::jsonb,
  false
),
(
  'ATL-UNI-003',
  'Conjunto camuflaje selva',
  $d$Camisa y pantalón de camuflaje selva en ripstop. Camisa de manga larga con bolsillos de pecho, hombreras y puños ajustables. Pantalón con bolsillos cargo y pretina reforzada. Patrón de selva de alto contraste para monte húmedo. Se vende como conjunto.$d$,
  'uniformes',
  320.00,
  array['S','M','L','XL','XXL'],
  '[{"name":"Selva","hex":"#3D4A2F"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1548449112-96a38a64381d?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?auto=format&fit=crop&w=900&q=80'
  ],
  'Ripstop polialgodón, estampado selva',
  980,
  array['Conjunto camisa + pantalón','Bolsillos de pecho y cargo','Puños ajustables','Ripstop'],
  '{"Incluye":"Camisa y pantalón","Patrón":"Selva","Manga":"Larga, arremangable"}'::jsonb,
  true
),
(
  'ATL-CAL-002',
  'Bota desierto transpirable',
  $d$Bota de caña media para clima cálido. Malla y gamuza en la capellada para ventilación, suela de goma que no se ablanda en asfalto caliente y plantilla extraíble. Menos peso que la bota de combate 8". Indicada para costa y zonas áridas.$d$,
  'calzado',
  299.00,
  array['38','39','40','41','42','43','44','45','46'],
  '[{"name":"Arena","hex":"#C2A878"},{"name":"Coyote","hex":"#9A7B4F"}]'::jsonb,
  array[
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80'
  ],
  'Gamuza, malla y suela de goma',
  980,
  array['Caña media','Capellada transpirable','Suela resistente al calor','Plantilla extraíble'],
  '{"Altura":"6 pulgadas","Clima":"Cálido y árido","Peso par":"980 g talla 42"}'::jsonb,
  false
)
on conflict (sku) do nothing;
