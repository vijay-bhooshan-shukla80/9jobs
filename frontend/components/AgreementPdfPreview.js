'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './AgreementPdfPreview.module.css';

export default function AgreementPdfPreview({ src, title = 'Agreement PDF' }) {
  const containerRef = useRef(null);
  const canvasRefs = useRef([]);
  const [pdf, setPdf] = useState(null);
  const [width, setWidth] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [error, setError] = useState('');
  const [pageText, setPageText] = useState([]);
  const [renderedPages, setRenderedPages] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(Math.round(entries[0].contentRect.width)));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;
    const load = async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        if (cancelled) return;
        pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
        loadingTask = pdfjs.getDocument({ url: src, withCredentials: true, disableRange: true, disableStream: true });
        const document = await loadingTask.promise;
        if (!cancelled) setPdf(document);
      } catch {
        if (!cancelled) setError('Unable to load the PDF preview. Open the agreement PDF to review it.');
      }
    };
    load();
    return () => {
      cancelled = true;
      loadingTask?.destroy().catch(() => {});
    };
  }, [src]);

  useEffect(() => {
    if (!pdf || width <= 0) return;
    let cancelled = false;
    const tasks = [];
    const render = async () => {
      try {
        const text = [];
        for (let index = 0; index < pdf.numPages; index++) {
          const page = await pdf.getPage(index + 1);
          if (cancelled) return;
          const canvas = canvasRefs.current[index];
          const naturalViewport = page.getViewport({ scale: 1 });
          const pageWidth = Math.max(200, Math.min(width - 32, 1000)) * zoom / 100;
          const viewport = page.getViewport({ scale: pageWidth / naturalViewport.width });
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
          canvas.width = Math.ceil(viewport.width * pixelRatio);
          canvas.height = Math.ceil(viewport.height * pixelRatio);
          canvas.style.width = `${Math.floor(viewport.width)}px`;
          canvas.style.height = `${Math.floor(viewport.height)}px`;
          const task = page.render({
            canvas, canvasContext: canvas.getContext('2d'), viewport,
            transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
          });
          tasks.push(task);
          await task.promise;
          if (cancelled) return;
          const content = await page.getTextContent();
          text.push(content.items.map(item => item.str || '').join(' '));
          setRenderedPages(index + 1);
          setPageText([...text]);
        }
      } catch (failure) {
        if (!cancelled && failure.name !== 'RenderingCancelledException') {
          setError('Unable to display the PDF preview. Open the agreement PDF to review it.');
        }
      }
    };
    render();
    return () => {
      cancelled = true;
      tasks.forEach(task => task.cancel());
    };
  }, [pdf, width, zoom]);

  return (
    <div ref={containerRef} className={styles.viewer} aria-label={title} data-rendered-pages={renderedPages}>
      <div className={styles.toolbar}>
        <span>{title}{pdf ? ` · ${pdf.numPages} pages` : ''}</span>
        <div className={styles.zoom}>
          <button type="button" aria-label="Zoom out PDF" disabled={zoom <= 75} onClick={() => setZoom(value => value - 25)}>−</button>
          <span>{zoom}%</span>
          <button type="button" aria-label="Zoom in PDF" disabled={zoom >= 150} onClick={() => setZoom(value => value + 25)}>+</button>
        </div>
      </div>
      {!pdf && !error ? <p className={styles.message} role="status">Loading agreement PDF...</p> : null}
      {error ? <p className={styles.message} role="alert">{error} <a href={src} target="_blank" rel="noreferrer">View Agreement PDF</a></p> : null}
      <div className={styles.pages}>
        {Array.from({ length: pdf?.numPages || 0 }, (_, index) => (
          <figure className={styles.page} key={index}>
            <canvas ref={canvas => { canvasRefs.current[index] = canvas; }} aria-label={`Agreement page ${index + 1}`} />
            <figcaption className={styles.pageText}>{pageText[index]}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
