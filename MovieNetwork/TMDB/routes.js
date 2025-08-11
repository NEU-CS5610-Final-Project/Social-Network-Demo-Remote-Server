// MovieNetwork/TMDB/routes.js
import axios from "axios";
import "dotenv/config";

const useV4 = !!process.env.TMDB_V4_TOKEN;

// TMDB client
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
  ...(useV4
    ? { headers: { Authorization: `Bearer ${process.env.TMDB_V4_TOKEN}` } }
    : { params: { api_key: process.env.TMDB_API_KEY } })
});

// Error response
function sendErr(res, e, fallback = "Upstream TMDB error") {
  const status = e?.response?.status || 500;
  const body = e?.response?.data || { error: fallback, details: e.message };
  return res.status(status).json(body);
}

export default function TMDBRoutes(app) {
  /** Search for movies:
   * GET /api/tmdb/search?q=Inception&lang=en-US&page=1&region=CA&year=2010
   * For example, GET /api/tmdb/search?q=Inception&lang=en-US&page=1&region=CA&year=2010 will return the search results for the movie "Inception"
   * For testing, you can use the following URL: http://localhost:4000/api/tmdb/search?q=Inception&lang=en-US&page=1&region=CA&year=2010
   */
  app.get("/api/tmdb/search", async (req, res) => {
    try {
      const { q, page = 1, lang = "en-US", region, year } = req.query;
      if (!q || String(q).trim() === "") {
        return res.status(400).json({ error: "Missing query param: q" });
      }
      const { data } = await tmdb.get("/search/movie", {
        params: { query: q, page, language: lang, region, year }
      });
      res.json(data);
    } catch (e) { sendErr(res, e, "TMDB search failed"); }
  });

  /** Movie details (credits, videos, images):
   * GET /api/tmdb/details/:id?lang=en-US
   * For example, GET /api/tmdb/details/27205?lang=en-US will return the details of the movie with id 27205
   * For testing, you can use the following URL: http://localhost:4000/api/tmdb/details/27205?lang=en-US
   */
  app.get("/api/tmdb/details/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { lang = "en-US" } = req.query;
      const idNum = Number(id);
      if (!Number.isInteger(idNum) || idNum <= 0) {
        return res.status(400).json({ error: "Invalid movie id" });
      }
  
      const { data } = await tmdb.get(`/movie/${idNum}`, {
        params: { language: lang }
      });
  
      const filtered = {
        adult: data.adult,
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        overview: data.overview,
        id: data.id,
        original_language: data.original_language,
        poster_path: data.poster_path,
        release_date: data.release_date,
        title: data.title,
        genres: data.genres,
      };
  
      res.json(filtered);
    } catch (e) {
      sendErr(res, e, "TMDB details failed");
    }
  });

  /** Get poster URL:
   * GET /api/tmdb/poster?id=27205&size=w500&lang=en-US
   * GET /api/tmdb/poster?title=Inception&year=2010&size=w500&lang=en-US
   * Can add redirect=1 to redirect to the image
   * For example, GET /api/tmdb/poster?id=27205&size=w500&lang=en-US&redirect=1 will redirect to the imageen
   * For testing, you can use the following URL: http://localhost:4000/api/tmdb/poster?id=27205&size=w500&lang=en-US&redirect=1
   */
  app.get("/api/tmdb/poster", async (req, res) => {
    try {
      const { id, title, year, size = "w500", lang = "en-US", redirect } = req.query;

      let posterPath = null;

      if (id) {
        const idNum = Number(id);
        if (!Number.isInteger(idNum) || idNum <= 0) {
          return res.status(400).json({ error: "Invalid movie id" });
        }
        const { data } = await tmdb.get(`/movie/${idNum}`, { params: { language: lang } });
        posterPath = data.poster_path;
      } else if (title) {
        const { data } = await tmdb.get("/search/movie", {
          params: { query: title, language: lang, page: 1, year }
        });
        const best = data.results?.[0];
        posterPath = best?.poster_path || null;
      } else {
        return res.status(400).json({ error: "Provide id or title" });
      }

      if (!posterPath) return res.status(404).json({ error: "Poster not found" });

      const url = `https://image.tmdb.org/t/p/${size}${posterPath}`;
      if (redirect) return res.redirect(url);
      res.json({ url });
    } catch (e) { sendErr(res, e, "TMDB poster failed"); }
  });

  /** Get image configuration (base_url and available sizes):
   * GET /api/tmdb/config
   * For example, GET /api/tmdb/config will return the image configuration
   * For testing, you can use the following URL: http://localhost:4000/api/tmdb/config
   */
  app.get("/api/tmdb/config", async (_req, res) => {
    try {
      const { data } = await tmdb.get("/configuration");
      res.json(data);
    } catch (e) { sendErr(res, e, "TMDB config failed"); }
  });
}