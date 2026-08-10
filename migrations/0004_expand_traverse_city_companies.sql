-- Expand Traverse City / Northern Michigan garage door company coverage
-- Updates existing Precise Door + B&B profiles and adds local competitors from market research.

UPDATE companies SET
  tags_json = '["Repair","Installation","Openers","Emergency"]',
  emergency = 1,
  about = 'Precise Door Company is a family-owned Traverse City dealer providing residential and commercial garage door installation, repair, and 24-hour emergency service across Grand Traverse, Leelanau, Benzie, Antrim, and Wexford counties.',
  emergency_hours = '24-hour emergency service',
  phone = '231-276-6601'
WHERE slug = 'precise-door-company';

DELETE FROM company_services WHERE company_id = (SELECT id FROM companies WHERE slug = 'precise-door-company');
DELETE FROM company_service_areas WHERE company_id = (SELECT id FROM companies WHERE slug = 'precise-door-company');

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
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'precise-door-company';
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
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'precise-door-company';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kingsley' FROM companies WHERE slug = 'precise-door-company';

UPDATE companies SET
  about = 'B&B Garage Doors and More is a family-owned, licensed, and insured Traverse City company serving Grand Traverse, Leelanau, Benzie, Antrim, and Kalkaska counties with residential and commercial garage door installation and repair.'
WHERE slug = 'bb-garage-doors-and-more';

DELETE FROM company_service_areas WHERE company_id = (SELECT id FROM companies WHERE slug = 'bb-garage-doors-and-more');

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
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'bb-garage-doors-and-more';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kingsley' FROM companies WHERE slug = 'bb-garage-doors-and-more';

INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'northern-michigan-door-pros'
AND NOT EXISTS (
  SELECT 1 FROM company_service_areas csa
  WHERE csa.company_id = (SELECT id FROM companies WHERE slug = 'northern-michigan-door-pros')
    AND csa.area = 'Traverse City'
);

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'compaan-door-operator',
  'Compaan Door & Operator Co',
  4.9, 1830, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Openers","Commercial"]',
  0, 0,
  'Compaan Door & Operator Co has installed and repaired residential and commercial garage doors across Michigan since 1955. Their Traverse City location at 1606 Barlow St serves Grand Traverse, Leelanau, Benzie, and Antrim counties with IDA-certified technicians and same-day service on morning calls.',
  'Mon–Fri, 7am–5pm', NULL, '231-943-1111', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Acme' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'compaan-door-operator';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'compaan-door-operator';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'northern-garage-doors',
  'Northern Garage Doors',
  4.8, 94, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Openers","Commercial"]',
  0, 0,
  'Northern Garage Doors operates a Traverse City showroom at 829 Robinwood Ct and serves Grand Traverse, Leelanau, Benzie, Antrim, and Kalkaska counties with Clopay doors, openers, and residential and commercial service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Acme' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cedar' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kingsley' FROM companies WHERE slug = 'northern-garage-doors';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'northern-garage-doors';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'garage-door-services-traverse-city',
  'Garage Door Services',
  4.7, 128, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Openers","Commercial"]',
  0, 0,
  'Garage Door Services has served greater Grand Traverse County for more than 35 years from 2550 Preston Dr in Traverse City, offering residential and commercial installation and repair with Raynor, Haas, Clopay, and LiftMaster products.',
  'Mon–Fri, 8am–4:30pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Acme' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kingsley' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'garage-door-services-traverse-city';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'garage-door-services-traverse-city';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'overhead-door-company-of-grand-traverse',
  'Overhead Door Company of Grand Traverse',
  4.7, 86, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Openers","Commercial"]',
  0, 0,
  'Overhead Door Company of Grand Traverse is an authorized Overhead Door distributor at 2550 Preston Drive in Traverse City, providing residential and commercial doors, openers, repair, and maintenance across Northern Michigan.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Acme' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Elk Rapids' FROM companies WHERE slug = 'overhead-door-company-of-grand-traverse';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'cadillac-grand-traverse-garage-door',
  'Cadillac & Grand Traverse Garage Door',
  4.6, 61, 'Traverse City, MI', 'traverse-city',
  '["Repair","Installation","Openers","Commercial"]',
  0, 0,
  'Cadillac & Grand Traverse Garage Door is a family-owned Northern Michigan company since 1982 with locations in Traverse City and Cadillac. They install and repair Garaga and Wayne Dalton residential, agricultural, commercial, and industrial doors.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kalkaska' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Frankfort' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Mount Pleasant' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Gaylord' FROM companies WHERE slug = 'cadillac-grand-traverse-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'all-day-garage-door-services',
  'All Day Garage Door Services',
  5.0, 20, 'Interlochen, MI', 'traverse-city',
  '["Repair","Installation","Openers"]',
  0, 0,
  'All Day Garage Door Services is a family-owned Interlochen company serving Traverse City and surrounding communities with residential and commercial garage door sales, installation, openers, and certified technician repairs.',
  'Mon–Sat, 9am–5pm', NULL, '231-392-9483', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kingsley' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'all-day-garage-door-services';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Frankfort' FROM companies WHERE slug = 'all-day-garage-door-services';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'hallzys-garage-door',
  'Hallzy''s Garage Door',
  4.9, 48, 'Thompsonville, MI', 'traverse-city',
  '["Repair","Installation","Openers","Emergency"]',
  0, 1,
  'Hallzy''s Garage Door LLC provides garage door installation, repair, openers, and 24-hour emergency service from Thompsonville across Grand Traverse, Benzie, Manistee, Kalkaska, Leelanau, Lake, and Mason counties.',
  'Mon–Sat, 7am–6pm', '24-hour emergency repairs', '231-970-1350', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Thompsonville' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Frankfort' FROM companies WHERE slug = 'hallzys-garage-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Manistee' FROM companies WHERE slug = 'hallzys-garage-door';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'garage-doors-done-right',
  'Garage Doors Done Right',
  4.8, 27, 'Cedar, MI', 'traverse-city',
  '["Repair","Installation","Springs"]',
  0, 0,
  'Garage Doors Done Right serves Cedar, Traverse City, and Leelanau County homeowners with residential garage door repair, spring replacement, and new door installation.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cedar' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Suttons Bay' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Empire' FROM companies WHERE slug = 'garage-doors-done-right';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'garage-doors-done-right';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'macks-garage-door-service',
  'Macks Garage Door Service & Repair',
  4.7, 18, 'Kingsley, MI', 'traverse-city',
  '["Repair","Installation","Emergency"]',
  0, 1,
  'Macks Garage Door Service & Repair serves Kingsley and the greater Traverse City area with residential garage door maintenance, installation, spring repair, and emergency service.',
  'Mon–Sat, 7am–6pm', 'Call for emergency availability', '231-920-4482', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Kingsley' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Interlochen' FROM companies WHERE slug = 'macks-garage-door-service';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Fife Lake' FROM companies WHERE slug = 'macks-garage-door-service';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'mr-specialties',
  'M&R Specialties',
  4.6, 34, 'Cadillac, MI', 'cadillac',
  '["Repair","Installation","Openers","Emergency"]',
  0, 1,
  'M&R Specialties has provided overhead garage door installation, opener service, spring replacement, and 24/7 on-call emergency repairs for Cadillac and surrounding Northern Michigan communities since 1995.',
  'Mon–Fri, 9am–5pm', '24/7 on-call emergency repairs', '231-429-2452', 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Manton' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Mesick' FROM companies WHERE slug = 'mr-specialties';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Lake City' FROM companies WHERE slug = 'mr-specialties';

INSERT INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'northwest-commercial-door',
  'Northwest Commercial Door & Hardware',
  4.5, 22, 'Traverse City, MI', 'traverse-city',
  '["Commercial","Repair","Installation"]',
  0, 0,
  'Northwest Commercial Door & Hardware serves Traverse City and Northern Michigan businesses with commercial overhead doors, operators, and related door hardware service.',
  'Mon–Fri, 8am–5pm', NULL, NULL, 'Since 2026', 0
);

INSERT INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Commercial Service' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Traverse City' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Cadillac' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Petoskey' FROM companies WHERE slug = 'northwest-commercial-door';
INSERT INTO company_service_areas (company_id, area)
SELECT id, 'Gaylord' FROM companies WHERE slug = 'northwest-commercial-door';

