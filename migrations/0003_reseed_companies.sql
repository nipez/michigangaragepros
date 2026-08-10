-- Reseed company directory with expanded Michigan listings
DELETE FROM company_service_areas;
DELETE FROM company_services;
DELETE FROM companies;

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'mm-garage-doors',
  'M&M Garage Doors',
  4.9, 564, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Openers","Emergency"]',
  1, 1,
  'M&M Garage Doors is a five-star rated Michigan garage door company serving Metro Detroit, Ann Arbor, Kent County, and Traverse City. LiftMaster dealers focused on residential repair, installation, and preventive maintenance.',
  'Mon–Sat, 7am–7pm', '24/7 response', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Zeeland' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Novi' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Rochester Hills' FROM companies WHERE slug = 'mm-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'mm-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'precision-garage-door-of-michigan',
  'Precision Garage Door of Michigan',
  4.8, 312, 'Detroit, MI', 'detroit',
  '["Repair","Installation","Openers","Emergency"]',
  0, 1,
  'Precision Garage Door of Michigan has served Southeast, Mid, and West Michigan since 2001 with IDEA-certified technicians for repair, openers, and new doors across Detroit, Grand Rapids, Ann Arbor, Lansing, and Kalamazoo.',
  'Mon–Sun, 7am–9pm', '24/7 repair', '734-219-3380', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Lansing' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'precision-garage-door-of-michigan';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'precision-garage-door-of-michigan';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  '313-garage-door',
  '313 Garage Door',
  4.9, 500, 'Detroit, MI', 'detroit',
  '["Repair","Installation","Emergency"]',
  0, 1,
  '313 Garage Door provides expert repair, installation, and 24/7 emergency service across Metro Detroit with same-day appointments and upfront pricing.',
  'Mon–Sat, 7am–8pm', '24/7 response', '313-591-9635', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dearborn' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Sterling Heights' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Southfield' FROM companies WHERE slug = '313-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Royal Oak' FROM companies WHERE slug = '313-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'environmental-door',
  'Environmental Door',
  5, 722, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Environmental Door is a high-volume Grand Rapids garage door company known for residential repair, installation, and opener service across West Michigan.',
  'Mon–Fri, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'environmental-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Muskegon' FROM companies WHERE slug = 'environmental-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'a1-garage-door-service',
  'A1 Garage Door Service',
  4.9, 1439, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Springs","Openers","Emergency"]',
  0, 1,
  'A1 Garage Door Service operates a large West Michigan crew network for residential garage door repair, springs, openers, and same-day emergency calls.',
  'Mon–Sun, 7am–9pm', '24/7 response', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Muskegon' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Norton Shores' FROM companies WHERE slug = 'a1-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Zeeland' FROM companies WHERE slug = 'a1-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'discount-door-co',
  'Discount Door CO LLC',
  5, 281, 'Comstock Park, MI', 'comstock-park',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Discount Door CO LLC is a Comstock Park–based garage door company serving Grand Rapids and northern Kent County with repair, installation, and maintenance.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Comstock Park' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'discount-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Rockford' FROM companies WHERE slug = 'discount-door-co';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'express-garage-door-repair',
  'Express Garage Door Repair',
  5, 219, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Springs","Emergency"]',
  0, 1,
  'Express Garage Door Repair focuses on fast residential repair and spring replacement for homeowners across the Grand Rapids metro.',
  'Mon–Sat, 7am–7pm', 'Same-day / after-hours', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'express-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'express-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'complete-garage-doors',
  'Complete Garage Doors LLC',
  5, 155, 'Byron Center, MI', 'byron-center',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Complete Garage Doors LLC serves Byron Center and southwest Grand Rapids suburbs with residential repair, new doors, and opener installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Byron Center' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'complete-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'complete-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'deboer-garage-doors',
  'DeBoer Garage Doors LLC',
  5, 106, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'DeBoer Garage Doors LLC is a Grand Rapids residential garage door contractor offering repair, installation, and seasonal maintenance.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'deboer-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'deboer-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'dynamic-garage-doors',
  'Dynamic Garage Doors, LLC',
  5, 56, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Openers","Installation"]',
  0, 0,
  'Dynamic Garage Doors, LLC provides residential garage door repair, opener service, and installation throughout Greater Grand Rapids.',
  'Mon–Fri, 8am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'dynamic-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'dynamic-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'compaan-garage-doors',
  'Compaan Garage Doors',
  4.8, 130, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'Compaan Garage Doors serves West Michigan homeowners and light commercial customers with repair, installation, and opener work.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'compaan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Zeeland' FROM companies WHERE slug = 'compaan-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'quality-door-of-grand-rapids',
  'Quality Door of Grand Rapids',
  5, 49, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Quality Door of Grand Rapids is a local shop focused on careful residential garage door repair and replacement.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'quality-door-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'quality-door-of-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'overhead-door-company-of-grand-rapids',
  'Overhead Door Company of Grand Rapids',
  4.7, 109, 'Wyoming, MI', 'wyoming',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'Overhead Door Company of Grand Rapids is an authorized Overhead Door™ distributor serving Wyoming and the Grand Rapids metro with residential and commercial door systems.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Muskegon' FROM companies WHERE slug = 'overhead-door-company-of-grand-rapids';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'bouma-bros-garage-doors',
  'Bouma Bros Garage Doors',
  4.6, 126, 'Wyoming, MI', 'wyoming',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Bouma Bros Garage Doors is a Wyoming-based family company serving West Michigan with residential garage door repair and installation.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grandville' FROM companies WHERE slug = 'bouma-bros-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Byron Center' FROM companies WHERE slug = 'bouma-bros-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'fix-a-go-garage-door-repair',
  'Fix a Go Garage Door Repair',
  4.9, 139, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Springs","Emergency"]',
  0, 1,
  'Fix a Go Garage Door Repair specializes in residential spring and opener repairs with responsive scheduling across Grand Rapids.',
  'Mon–Sat, 7am–7pm', 'After-hours available', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'fix-a-go-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'west-michigan-door-co',
  'West Michigan Door Co',
  4.4, 41, 'Walker, MI', 'walker',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'West Michigan Door Co serves Walker and the northwest Grand Rapids suburbs with residential and light commercial garage door service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'west-michigan-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Comstock Park' FROM companies WHERE slug = 'west-michigan-door-co';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'professional-overhead-door',
  'Professional Overhead Door',
  4.8, 25, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Professional Overhead Door provides residential garage door sales, service, and opener installs in the Grand Rapids area.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'professional-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'professional-overhead-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'blitz-garage-door-repair',
  'Blitz Garage Door Repair',
  5, 14, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Springs","Emergency"]',
  0, 1,
  'Blitz Garage Door Repair is a Grand Rapids residential repair specialist focused on springs, cables, and same-day fixes.',
  'Mon–Sat, 7am–7pm', 'Same-day when available', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'blitz-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'blitz-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'empire-garage-doors',
  'Empire Garage Doors',
  5, 11, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation"]',
  0, 0,
  'Empire Garage Doors serves Grand Rapids homeowners with residential garage door repair and replacement.',
  'Mon–Fri, 8am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'empire-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'empire-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'town-and-country-door',
  'Town & Country Door LLC',
  4.8, 932, 'Detroit, MI', 'detroit',
  '["Repair","Installation","Commercial","Emergency"]',
  0, 1,
  'Town & Country Door LLC has served Metro Detroit since 1995 with residential and commercial garage door installation, repair, and emergency service.',
  'Mon–Sat, 7am–7pm', 'Emergency services offered', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dearborn' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Royal Oak' FROM companies WHERE slug = 'town-and-country-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Southfield' FROM companies WHERE slug = 'town-and-country-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'ezhawk-garage-door',
  'EZhawk Garage Door',
  4.9, 54, 'Detroit, MI', 'detroit',
  '["Repair","Openers","Emergency"]',
  0, 1,
  'EZhawk Garage Door has served Detroit-area homeowners since 2014 with repair, opener installs, and emergency response.',
  'Mon–Sat, 7am–7pm', 'Emergency services offered', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dearborn' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'ezhawk-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Southfield' FROM companies WHERE slug = 'ezhawk-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'elite-garage-door-repair-of-detroit',
  'Elite Garage Door Repair of Detroit',
  4.7, 25, 'Detroit, MI', 'detroit',
  '["Repair","Openers","Emergency"]',
  0, 1,
  'Elite Garage Door Repair of Detroit provides residential garage door and opener repair with free estimates across Metro Detroit.',
  'Mon–Sat, 8am–6pm', 'Emergency services offered', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dearborn' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Royal Oak' FROM companies WHERE slug = 'elite-garage-door-repair-of-detroit';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'garage-door-md',
  'Garage Door MD',
  5, 11, 'Detroit, MI', 'detroit',
  '["Repair","Installation","Commercial","Emergency"]',
  0, 1,
  'Garage Door MD handles residential and commercial garage door repair and replacement across the Detroit metro with competitive pricing and clear communication.',
  'Mon–Fri, 8am–6pm', 'Emergency services offered', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'garage-door-md';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'garage-door-md';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'suburban-door-company',
  'Suburban Door Company',
  5, 120, 'Detroit, MI', 'detroit',
  '["Installation","Repair","Commercial"]',
  0, 0,
  'Suburban Door Company has served Metro Detroit since 1948 with residential and commercial garage door installation, repair, and opener systems.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Novi' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Canton' FROM companies WHERE slug = 'suburban-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Westland' FROM companies WHERE slug = 'suburban-door-company';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'ais-garage-door-repair',
  'AIS Garage Door Repair',
  4.4, 25, 'Detroit, MI', 'detroit',
  '["Repair","Openers","Installation"]',
  0, 0,
  'AIS Garage Door Repair serves Detroit-area homeowners with garage door repair, opener installation, and track and spring service.',
  'Mon–Fri, 8am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dearborn' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'ais-garage-door-repair';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Southfield' FROM companies WHERE slug = 'ais-garage-door-repair';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'just-us-garage-service',
  'Just Us Garage Service',
  4.8, 18, 'Detroit, MI', 'detroit',
  '["Repair","Installation","Emergency"]',
  0, 1,
  'Just Us Garage Service provides residential and commercial garage door repair, installation, and maintenance throughout Southeast Michigan with transparent pricing.',
  'Mon–Sat, 7am–7pm', 'Emergency services offered', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Detroit' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'just-us-garage-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'just-us-garage-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'overhead-door-of-ann-arbor',
  'Overhead Door of Ann Arbor',
  4.8, 210, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair","Installation","Commercial","Emergency"]',
  0, 1,
  'Overhead Door Company of Ann Arbor (also serving Battle Creek and Jackson) has provided residential and commercial garage door sales, repair, and 24/7 service for over 40 years.',
  'Mon–Fri, 7am–5pm', '24/7 on-call service', '734-492-1616', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Saline' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Chelsea' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dexter' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Jackson' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Battle Creek' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Brighton' FROM companies WHERE slug = 'overhead-door-of-ann-arbor';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'ann-arbor-door-systems',
  'Ann Arbor Door Systems',
  4.7, 88, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Ann Arbor Door Systems serves Washtenaw County homeowners with garage door repair, opener service, and new door installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Saline' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dexter' FROM companies WHERE slug = 'ann-arbor-door-systems';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Chelsea' FROM companies WHERE slug = 'ann-arbor-door-systems';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'dexter-garage-door',
  'Dexter Garage Door',
  4.9, 64, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair","Springs","Installation"]',
  0, 0,
  'Dexter Garage Door serves western Washtenaw County and the Ann Arbor area with residential spring repair, door replacement, and opener installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dexter' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Chelsea' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Brighton' FROM companies WHERE slug = 'dexter-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Howell' FROM companies WHERE slug = 'dexter-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'beckway-door',
  'Beckway Door',
  4.8, 72, 'Ann Arbor, MI', 'ann-arbor',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'Beckway Door provides residential and commercial overhead door service for Ann Arbor and surrounding Southeast Michigan communities.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ypsilanti' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Canton' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Plymouth' FROM companies WHERE slug = 'beckway-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'beckway-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'overhead-door-company-of-lansing',
  'Overhead Door Company of Lansing',
  4.7, 145, 'Lansing, MI', 'lansing',
  '["Repair","Installation","Commercial","Emergency"]',
  0, 1,
  'Overhead Door Company of Lansing™ installs and repairs residential and commercial garage doors and openers across mid-Michigan, with emergency service available.',
  'Mon–Fri, 7am–5pm', 'Emergency service available', '517-201-0505', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Lansing' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'East Lansing' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Okemos' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holt' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Mason' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Howell' FROM companies WHERE slug = 'overhead-door-company-of-lansing';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Jackson' FROM companies WHERE slug = 'overhead-door-company-of-lansing';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'capital-city-garage-doors',
  'Capital City Garage Doors',
  4.8, 96, 'Lansing, MI', 'lansing',
  '["Repair","Springs","Openers"]',
  0, 0,
  'Capital City Garage Doors serves Lansing and mid-Michigan with residential repair, spring replacement, and opener service.',
  'Mon–Sat, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Lansing' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'East Lansing' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Okemos' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holt' FROM companies WHERE slug = 'capital-city-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Ledge' FROM companies WHERE slug = 'capital-city-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'mid-michigan-door-service',
  'Mid-Michigan Door Service',
  4.7, 58, 'Lansing, MI', 'lansing',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Mid-Michigan Door Service covers Lansing, East Lansing, and nearby communities with residential garage door repair and installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Lansing' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'East Lansing' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Mason' FROM companies WHERE slug = 'mid-michigan-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Howell' FROM companies WHERE slug = 'mid-michigan-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'overhead-door-company-of-kalamazoo',
  'Overhead Door Company of Kalamazoo',
  4.8, 178, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'Overhead Door Company of Kalamazoo™ has served Southwestern Michigan for over 40 years with residential and commercial garage doors, openers, and repair.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Portage' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Battle Creek' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Parchment' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Benton Harbor' FROM companies WHERE slug = 'overhead-door-company-of-kalamazoo';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'fawley-overhead-door',
  'Fawley Overhead Door',
  4.7, 84, 'Kalamazoo, MI', 'kalamazoo',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Fawley Overhead Door serves Kalamazoo and Southwest Michigan with residential garage door repair, installation, and opener service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Portage' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Battle Creek' FROM companies WHERE slug = 'fawley-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Vicksburg' FROM companies WHERE slug = 'fawley-overhead-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'southwest-michigan-garage-doors',
  'Southwest Michigan Garage Doors',
  4.6, 47, 'Portage, MI', 'portage',
  '["Repair","Springs","Installation"]',
  0, 0,
  'Southwest Michigan Garage Doors serves Portage, Kalamazoo, and Battle Creek with residential spring repair and door replacement.',
  'Mon–Sat, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Portage' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'southwest-michigan-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Battle Creek' FROM companies WHERE slug = 'southwest-michigan-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'precise-door-company',
  'Precise Door Company',
  4.8, 112, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Precise Door Company is a Traverse City / Northern Michigan dealer for garage door installation, repair, and maintenance.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Acme' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'precise-door-company';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'bb-garage-doors-and-more',
  'B&B Garage Doors and More',
  4.9, 76, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Emergency"]',
  0, 1,
  'B&B Garage Doors and More installs and repairs garage doors for homeowners across Traverse City and Northern Michigan counties.',
  'Mon–Sat, 7am–6pm', 'Call for emergency availability', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Charlevoix' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Gaylord' FROM companies WHERE slug = 'bb-garage-doors-and-more';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'northern-michigan-door-pros',
  'Northern Michigan Door Pros',
  4.7, 39, 'Petoskey, MI', 'petoskey',
  '["Repair","Openers","Installation"]',
  0, 0,
  'Northern Michigan Door Pros serves Petoskey, Harbor Springs, and surrounding lakeshore communities with residential garage door service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Harbor Springs' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Charlevoix' FROM companies WHERE slug = 'northern-michigan-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Gaylord' FROM companies WHERE slug = 'northern-michigan-door-pros';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'laroy-door-sales-and-services',
  'LaRoy Door Sales & Services',
  4.6, 71, 'Monroe, MI', 'monroe',
  '["Repair","Installation","Openers"]',
  0, 0,
  'LaRoy Door Sales & Services serves Monroe and Southeast Michigan with residential garage door sales, repair, and opener installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Monroe' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Frenchtown' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Temperance' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dundee' FROM companies WHERE slug = 'laroy-door-sales-and-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Flat Rock' FROM companies WHERE slug = 'laroy-door-sales-and-services';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'genesee-county-garage-doors',
  'Genesee County Garage Doors',
  4.7, 83, 'Flint, MI', 'flint',
  '["Repair","Springs","Installation"]',
  0, 0,
  'Genesee County Garage Doors serves Flint, Grand Blanc, and surrounding communities with residential repair, springs, and new door installs.',
  'Mon–Sat, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Flint' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Burton' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Fenton' FROM companies WHERE slug = 'genesee-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Davison' FROM companies WHERE slug = 'genesee-county-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'flint-area-overhead-door',
  'Flint Area Overhead Door',
  4.6, 52, 'Grand Blanc, MI', 'grand-blanc',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'Flint Area Overhead Door provides residential and commercial garage door service throughout Genesee County.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Blanc' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Flint' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Burton' FROM companies WHERE slug = 'flint-area-overhead-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Fenton' FROM companies WHERE slug = 'flint-area-overhead-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'saginaw-valley-garage-doors',
  'Saginaw Valley Garage Doors',
  4.7, 67, 'Saginaw, MI', 'saginaw',
  '["Repair","Openers","Installation"]',
  0, 0,
  'Saginaw Valley Garage Doors serves Saginaw, Bay City, and Midland with residential garage door repair, openers, and installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Saginaw' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Bay City' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Midland' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Freeland' FROM companies WHERE slug = 'saginaw-valley-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Essexville' FROM companies WHERE slug = 'saginaw-valley-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'tri-city-door-service',
  'Tri-City Door Service',
  4.8, 54, 'Bay City, MI', 'bay-city',
  '["Repair","Springs","Emergency"]',
  0, 1,
  'Tri-City Door Service covers Bay City, Saginaw, and Midland with residential spring repair and emergency garage door service.',
  'Mon–Sat, 7am–7pm', 'Same-day when available', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Bay City' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Saginaw' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Midland' FROM companies WHERE slug = 'tri-city-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Essexville' FROM companies WHERE slug = 'tri-city-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'midland-garage-door-co',
  'Midland Garage Door Co.',
  4.7, 41, 'Midland, MI', 'midland',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Midland Garage Door Co. serves Midland and nearby mid-Michigan communities with residential repair, installation, and tune-ups.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Midland' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Saginaw' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Bay City' FROM companies WHERE slug = 'midland-garage-door-co';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'midland-garage-door-co';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'lakeshore-garage-door-service',
  'Lakeshore Garage Door Service',
  4.8, 91, 'Holland, MI', 'holland',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Lakeshore Garage Door Service serves Holland, Zeeland, and the lakeshore corridor with residential garage door repair and installation.',
  'Mon–Fri, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Holland' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Zeeland' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Haven' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Muskegon' FROM companies WHERE slug = 'lakeshore-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Norton Shores' FROM companies WHERE slug = 'lakeshore-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'muskegon-door-works',
  'Muskegon Door Works',
  4.6, 48, 'Muskegon, MI', 'muskegon',
  '["Repair","Springs","Installation"]',
  0, 0,
  'Muskegon Door Works provides residential garage door repair and installation for Muskegon, Norton Shores, and Grand Haven.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Muskegon' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Norton Shores' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Grand Haven' FROM companies WHERE slug = 'muskegon-door-works';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Spring Lake' FROM companies WHERE slug = 'muskegon-door-works';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'oakland-county-garage-doors',
  'Oakland County Garage Doors',
  4.8, 134, 'Troy, MI', 'troy',
  '["Repair","Installation","Emergency"]',
  0, 1,
  'Oakland County Garage Doors serves Troy, Rochester Hills, Birmingham, and surrounding Oakland County communities with repair and installation.',
  'Mon–Sat, 7am–7pm', 'After-hours available', NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Troy' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Rochester Hills' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Birmingham' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Auburn Hills' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Pontiac' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Royal Oak' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'oakland-county-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Novi' FROM companies WHERE slug = 'oakland-county-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'macomb-door-pros',
  'Macomb Door Pros',
  4.7, 79, 'Sterling Heights, MI', 'sterling-heights',
  '["Repair","Springs","Openers"]',
  0, 0,
  'Macomb Door Pros serves Sterling Heights, Clinton Township, Shelby Township, and Macomb County with residential garage door service.',
  'Mon–Sat, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Sterling Heights' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Clinton Township' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Shelby Township' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Macomb' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Warren' FROM companies WHERE slug = 'macomb-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Utica' FROM companies WHERE slug = 'macomb-door-pros';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'wayne-county-garage-door',
  'Wayne County Garage Door',
  4.6, 63, 'Livonia, MI', 'livonia',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Wayne County Garage Door serves Livonia, Canton, Westland, and western Wayne County with residential repair and installation.',
  'Mon–Fri, 8am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Canton' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Westland' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Plymouth' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Dearborn' FROM companies WHERE slug = 'wayne-county-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Garden City' FROM companies WHERE slug = 'wayne-county-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'dover-doors',
  'Dover Doors',
  4.7, 95, 'Farmington Hills, MI', 'farmington-hills',
  '["Repair","Installation","Commercial"]',
  0, 0,
  'Dover Doors serves Farmington Hills and Metro Detroit with residential and commercial garage door sales, service, and installation.',
  'Mon–Fri, 7am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Farmington Hills' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Novi' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Livonia' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Southfield' FROM companies WHERE slug = 'dover-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'West Bloomfield' FROM companies WHERE slug = 'dover-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'port-huron-door-service',
  'Port Huron Door Service',
  4.6, 33, 'Port Huron, MI', 'port-huron',
  '["Repair","Openers","Installation"]',
  0, 0,
  'Port Huron Door Service covers the Blue Water area with residential garage door repair, openers, and new installs.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Port Huron' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Marysville' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'St. Clair' FROM companies WHERE slug = 'port-huron-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Fort Gratiot' FROM companies WHERE slug = 'port-huron-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'up-garage-door-service',
  'U.P. Garage Door Service',
  4.8, 28, 'Marquette, MI', 'marquette',
  '["Repair","Installation","Openers"]',
  0, 0,
  'U.P. Garage Door Service serves Marquette and the central Upper Peninsula with residential garage door repair and installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Marquette' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ishpeming' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Negaunee' FROM companies WHERE slug = 'up-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Gwinn' FROM companies WHERE slug = 'up-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'battle-creek-door-company',
  'Battle Creek Door Company',
  4.7, 44, 'Battle Creek, MI', 'battle-creek',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Battle Creek Door Company serves Calhoun County with residential garage door repair, installation, and maintenance.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Battle Creek' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Portage' FROM companies WHERE slug = 'battle-creek-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Marshall' FROM companies WHERE slug = 'battle-creek-door-company';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'jackson-garage-door-pros',
  'Jackson Garage Door Pros',
  4.6, 37, 'Jackson, MI', 'jackson',
  '["Repair","Springs","Openers"]',
  0, 0,
  'Jackson Garage Door Pros serves Jackson and nearby mid-Michigan towns with residential spring, opener, and door repair.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Jackson' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Lansing' FROM companies WHERE slug = 'jackson-garage-door-pros';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Battle Creek' FROM companies WHERE slug = 'jackson-garage-door-pros';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'brighton-howell-garage-doors',
  'Brighton & Howell Garage Doors',
  4.8, 59, 'Brighton, MI', 'brighton',
  '["Repair","Installation","Openers"]',
  0, 0,
  'Brighton & Howell Garage Doors serves Livingston County homeowners with repair, opener service, and new door installation.',
  'Mon–Sat, 7am–6pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Brighton' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Howell' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Milford' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Ann Arbor' FROM companies WHERE slug = 'brighton-howell-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Novi' FROM companies WHERE slug = 'brighton-howell-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'mount-pleasant-door-service',
  'Mount Pleasant Door Service',
  4.7, 26, 'Mount Pleasant, MI', 'mount-pleasant',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Mount Pleasant Door Service covers Isabella County and nearby mid-Michigan communities with residential garage door work.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Midland' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Clare' FROM companies WHERE slug = 'mount-pleasant-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Alma' FROM companies WHERE slug = 'mount-pleasant-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'st-joseph-lakeshore-doors',
  'St. Joseph Lakeshore Doors',
  4.6, 31, 'Benton Harbor, MI', 'benton-harbor',
  '["Repair","Installation","Openers"]',
  0, 0,
  'St. Joseph Lakeshore Doors serves Benton Harbor, St. Joseph, and Southwest Michigan lakeshore towns with residential garage door service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Benton Harbor' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Saint Joseph' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Niles' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'South Haven' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalamazoo' FROM companies WHERE slug = 'st-joseph-lakeshore-doors';
