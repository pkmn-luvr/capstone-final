\echo 'Delete and recreate ACNH db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS ACNH;
CREATE DATABASE ACNH;
\connect ACNH

\i ACNH-schema.sql
\i ACNH-seed.sql

\echo 'Delete and recreate ACNH_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS ACNH_test;
CREATE DATABASE ACNH_test;
\connect ACNH_test

\i ACNH-schema.sql
