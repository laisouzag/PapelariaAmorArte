-- ============================================================================
-- CORREÇÃO DOS CAMINHOS DAS IMAGENS
-- ============================================================================
-- Este script corrige os caminhos das imagens removendo subdiretórios inexistentes
-- Os arquivos estão diretamente na pasta img/ sem subdiretórios

USE papelaria_amor_arte_completo;

-- Atualizar caminhos das imagens removendo subdiretórios
UPDATE product_images SET image_url = 'img/Agenda2026Personalizada.png' WHERE image_url = 'img/Agendas-Planners/Agenda2026Personalizada.png';
UPDATE product_images SET image_url = 'img/AgendaPersonalizadaSãoBento.png' WHERE image_url = 'img/Agendas-Planners/AgendaPersonalizadaSãoBento.png';
UPDATE product_images SET image_url = 'img/Planner2026.png' WHERE image_url = 'img/Agendas-Planners/Planner2026.png';
UPDATE product_images SET image_url = 'img/TerçoPrata.png' WHERE image_url = 'img/Terços/TerçoPrata.png';
UPDATE product_images SET image_url = 'img/TerçoRoxo.png' WHERE image_url = 'img/Terços/TerçoMadeira.png';
UPDATE product_images SET image_url = 'img/TerçoPerolaN.S.DasGraças.png' WHERE image_url = 'img/Terços/TerçoNossaSenhoraDasGraças.png';
UPDATE product_images SET image_url = 'img/CadernoDeOraçãoCarlosAcutis.png' WHERE image_url = 'img/CadernoDeOração/CadernoDeOraçãoCarlosAcutis.png';
UPDATE product_images SET image_url = 'img/CadernoDeOraçãoN.S.DasGraças.png' WHERE image_url = 'img/CadernoDeOração/CadernoNossaSenhoraDasGraças.png';
UPDATE product_images SET image_url = 'img/ChaveiroLembrançaMDF.png' WHERE image_url = 'img/MDF/ChaveiroLembrança.png';
UPDATE product_images SET image_url = 'img/N.SenhoraMDF.png' WHERE image_url = 'img/MDF/PlacaFamilia.png';
UPDATE product_images SET image_url = 'img/Calendario2026CarlosAcutis.png' WHERE image_url = 'img/Calendario2026/Calendario2026CarlosAcutis.png';
UPDATE product_images SET image_url = 'img/Calendario2026N.S.Aparecida.png' WHERE image_url = 'img/Calendario2026/Calendario2026N.S.Aparecida.png';
UPDATE product_images SET image_url = 'img/BlocoDeNotasSãoPaulo.png' WHERE image_url = 'img/BlocoDeNotas/BlocoDeNotasSãoPaulo.png';
UPDATE product_images SET image_url = 'img/BlocoDeNotasPalmeiras.png' WHERE image_url = 'img/BlocoDeNotas/BlocoDeNotasPalmeiras.png';
UPDATE product_images SET image_url = 'img/BlocoDeNotasCorinthians.png' WHERE image_url = 'img/BlocoDeNotas/BlocoDeNotasCorinthians.png';
UPDATE product_images SET image_url = 'img/KitN.S.Aparecida.png' WHERE image_url = 'img/Kits/KitPresente.png';
UPDATE product_images SET image_url = 'img/KitPrimeiraEucaristiaAzul.png' WHERE image_url = 'img/Kits/KitComunhao.png';
UPDATE product_images SET image_url = 'img/logo.png' WHERE image_url = 'img/Canetas/CanetaPremium.png';
UPDATE product_images SET image_url = 'img/logo.png' WHERE image_url = 'img/Lapis/LapisPremium.png';
UPDATE product_images SET image_url = 'img/logo.png' WHERE image_url = 'img/Religiosos/BibliaBolso.png';
UPDATE product_images SET image_url = 'img/logo.png' WHERE image_url = 'img/Religiosos/Santinho.png';

-- Verificar as atualizações
SELECT id, product_id, image_url FROM product_images;
