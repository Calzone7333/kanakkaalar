import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, name, type }) {
    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | Kanakkaalar` : 'Kanakkaalar - Your Financial Compliance Partner'}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type || 'website'} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter */}
            <meta name="twitter:creator" content={name || 'Kanakkaalar'} />
            <meta name="twitter:card" content={type || 'summary_large_image'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}

SEO.defaultProps = {
    title: 'Kanakkaalar',
    description: 'India\'s Smart Online Platform for Modern Businesses. Legal, tax, and compliance simplification.',
    keywords: 'business registration, tax filing, compliance, startup india, gst registration, trademark'
};
