INSERT OR IGNORE INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'lakeside-garage-door-service',
  'Lakeside Garage Door Service',
  4.9, 184, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Springs","Openers","Installation"]',
  1, 1,
  'Lakeside Garage Door Service is a family-run company serving Grand Rapids and West Michigan.',
  'Mon-Sat, 7am-7pm', '24/7 response', '616-555-0142', 'Since 2026', 0
);

INSERT OR IGNORE INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'great-lakes-garage-doors',
  'Great Lakes Garage Doors',
  4.8, 126, 'Lansing, MI', 'lansing',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'Great Lakes Garage Doors serves Lansing and mid-Michigan with residential repair and installation.',
  'Mon-Fri, 8am-6pm', NULL, NULL, 'Since 2026', 0
);

INSERT OR IGNORE INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'north-shore-garage-door-co',
  'North Shore Garage Door Co.',
  4.9, 93, 'Traverse City, MI', 'traverse-city',
  '["Repair","Openers","Emergency"]',
  0, 1,
  'North Shore Garage Door Co. covers Traverse City and northern Michigan.',
  'Mon-Sat, 7am-6pm', '24/7 response', NULL, 'Since 2026', 0
);

INSERT OR IGNORE INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'motor-city-garage-door-service',
  'Motor City Garage Door Service',
  4.7, 211, 'Detroit, MI', 'detroit',
  '["Repair","Springs","Commercial"]',
  0, 0,
  'Motor City Garage Door Service handles residential and light commercial work across metro Detroit.',
  'Mon-Sat, 7am-7pm', NULL, NULL, 'Since 2026', 0
);

INSERT OR IGNORE INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'river-city-door-works',
  'River City Door Works',
  4.8, 74, 'Grand Rapids, MI', 'grand-rapids',
  '["Repair","Installation","Maintenance"]',
  0, 0,
  'River City Door Works is a Grand Rapids-based shop focused on residential repair and installation.',
  'Mon-Fri, 8am-5pm', NULL, NULL, 'Since 2026', 0
);

INSERT OR IGNORE INTO companies (
  slug, name, rating, reviews, city, city_slug, tags_json, featured, emergency,
  about, hours, emergency_hours, phone, on_platform, claimed
) VALUES (
  'west-michigan-overhead-door',
  'West Michigan Overhead Door',
  4.7, 58, 'Wyoming, MI', 'grand-rapids',
  '["Repair","Springs","Commercial"]',
  0, 0,
  'West Michigan Overhead Door serves Wyoming and the Grand Rapids metro.',
  'Mon-Fri, 7am-6pm', NULL, NULL, 'Since 2026', 0
);

INSERT OR IGNORE INTO company_services (company_id, service)
SELECT id, 'Garage Door Repair' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_services (company_id, service)
SELECT id, 'Broken Spring Replacement' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_services (company_id, service)
SELECT id, 'Opener Repair & Install' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_services (company_id, service)
SELECT id, 'New Door Installation' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_services (company_id, service)
SELECT id, 'Maintenance & Tune-ups' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_services (company_id, service)
SELECT id, 'Emergency Service' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_service_areas (company_id, area)
SELECT id, 'Grand Rapids' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_service_areas (company_id, area)
SELECT id, 'Wyoming' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_service_areas (company_id, area)
SELECT id, 'Kentwood' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_service_areas (company_id, area)
SELECT id, 'Walker' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_service_areas (company_id, area)
SELECT id, 'Grandville' FROM companies WHERE slug = 'lakeside-garage-door-service';

INSERT OR IGNORE INTO company_service_areas (company_id, area)
SELECT id, 'Rockford' FROM companies WHERE slug = 'lakeside-garage-door-service';
