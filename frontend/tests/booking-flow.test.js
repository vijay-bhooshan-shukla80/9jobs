import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';

const root = path.resolve(process.cwd());

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('public booking flow regression', () => {
  test('routes every scheduling CTA through the enlarged Calendly booking page', () => {
    const calendlyLink = read('components/CalendlyWidget.js');
    const navbar = read('components/Navbar.js');
    const homeHero = read('components/homepage/HomeHero.js');
    const hero = read('components/Hero.js');
    const testimonials = read('app/testimonials/TestimonialsContent.js');

    expect(calendlyLink).toContain('BOOKING_PATH = "/book-a-call"');
    expect(calendlyLink).toContain('href={BOOKING_PATH}');
    expect(calendlyLink).not.toContain('target="_blank"');
    expect(navbar.match(/<CalendlyLink/g)).toHaveLength(4);
    expect(navbar).not.toContain('href="tel:+61422279428"');
    expect(homeHero).toContain('<CalendlyLink className={styles.trial}>2 Days Trial</CalendlyLink>');
    expect(homeHero).toContain('<CalendlyLink className={styles.demo}>Get a demo</CalendlyLink>');
    expect(hero).toContain('<CalendlyLink className="btn btn-light">');
    expect(testimonials).toContain('<span>Book a call</span>');
  });

  test('uses the exact Cal ID event and a larger responsive desktop stage', () => {
    const bookingEmbed = read('components/CalendlyBooking.js');
    const bookingStyles = read('app/book-a-call/page.module.css');

    expect(bookingEmbed).toContain('https://calendly.com/mayanksodhi11/30min');
    expect(bookingEmbed).toContain('background_color=ffffff');
    expect(bookingEmbed).toContain('text_color=243b53');
    expect(bookingEmbed).toContain('primary_color=0b87f7');
    expect(bookingEmbed).toContain('title="Book a call with the 9Jobs team"');
    expect(bookingStyles).toContain('--booking-scale: 1.14');
    expect(bookingStyles).toContain('--booking-scale: 1;');
  });

});
