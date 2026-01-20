-- Seeding Experts (Deepak and Gayathiri for each Consulting Service)
-- Note: Assuming 'experts' table exists (created by Hibernate)

INSERT INTO experts (name, qualification, price, experience, rating, reviews, available, bio) VALUES 
('Deepak', 'Due Diligence', '2500', '10 Years', 4.8, 45, true, 'Standard: 2500, Premium: 2500, Elite: 2500'),
('Gayathiri', 'Due Diligence', '2500', '8 Years', 4.9, 32, true, 'Standard: 2500, Premium: 2500, Elite: 2500'),

('Deepak', 'Pitch Deck Service', '7500', '10 Years', 4.8, 12, true, 'Standard: 7500, Premium: 7500, Elite: 7500'),
('Gayathiri', 'Pitch Deck Service', '7500', '8 Years', 4.9, 28, true, 'Standard: 7500, Premium: 7500, Elite: 7500'),

('Deepak', 'NDA', 'Free', '10 Years', 4.8, 55, true, 'Standard: Free'),
('Gayathiri', 'NDA', 'Free', '8 Years', 4.9, 40, true, 'Standard: Free'),

('Deepak', 'Master Service Agreement', '2000', '10 Years', 4.8, 22, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),
('Gayathiri', 'Master Service Agreement', '2000', '8 Years', 4.9, 15, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),

('Deepak', 'Franchise Agreement', '2000', '10 Years', 4.8, 18, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),
('Gayathiri', 'Franchise Agreement', '2000', '8 Years', 4.9, 10, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),

('Deepak', 'Joint Venture Agreement', '2000', '10 Years', 4.8, 20, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),
('Gayathiri', 'Joint Venture Agreement', '2000', '8 Years', 4.9, 14, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),

('Deepak', 'Founders Agreements', '2000', '10 Years', 4.8, 25, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),
('Gayathiri', 'Founders Agreements', '2000', '8 Years', 4.9, 19, true, 'Standard: 2000, Premium: 2000, Elite: 2000'),

('Deepak', 'Consultancy Services Agreement', '1000', '10 Years', 4.8, 30, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),
('Gayathiri', 'Consultancy Services Agreement', '1000', '8 Years', 4.9, 22, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),

('Deepak', 'Employment Agreement', '1000', '10 Years', 4.8, 35, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),
('Gayathiri', 'Employment Agreement', '1000', '8 Years', 4.9, 28, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),

('Deepak', 'Employment Contract', '1000', '10 Years', 4.8, 40, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),
('Gayathiri', 'Employment Contract', '1000', '8 Years', 4.9, 30, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),

('Deepak', 'Service Contract', '1000', '10 Years', 4.8, 15, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),
('Gayathiri', 'Service Contract', '1000', '8 Years', 4.9, 12, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),

('Deepak', 'Legal Notice', '1499', '10 Years', 4.8, 50, true, 'Standard: 1499, Premium: 2499'),
('Gayathiri', 'Legal Notice', '1499', '8 Years', 4.9, 45, true, 'Standard: 1499, Premium: 2499'),

('Deepak', 'Cheque Bounce Notice', '2500', '10 Years', 4.8, 42, true, 'Standard: 2500, Premium: 3500'),
('Gayathiri', 'Cheque Bounce Notice', '2500', '8 Years', 4.9, 38, true, 'Standard: 2500, Premium: 3500'),

('Deepak', 'Recovery of Dues', '1000', '10 Years', 4.8, 55, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),
('Gayathiri', 'Recovery of Dues', '1000', '8 Years', 4.9, 48, true, 'Standard: 1000, Premium: 1000, Elite: 1000'),

('Deepak', 'Terms of Service and Privacy Policy', '1500', '10 Years', 4.8, 33, true, 'Standard: 1500, Premium: 1500, Elite: 1500'),
('Gayathiri', 'Terms of Service and Privacy Policy', '1500', '8 Years', 4.9, 29, true, 'Standard: 1500, Premium: 1500, Elite: 1500');

-- Note: Specializations are stored in a separate table 'experts_specialization' or similar by Hibernate.
-- For simplicity in this direct SQL, we rely on 'qualification' to show the Service Name on the card.
