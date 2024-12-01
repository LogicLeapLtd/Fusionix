$logos = @{
    "google-analytics" = "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg"
    "mixpanel" = "https://cdn.worldvectorlogo.com/logos/mixpanel.svg"
    "amplitude" = "https://cdn.worldvectorlogo.com/logos/amplitude-1.svg"
    "google-ads" = "https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Google_Ads_logo.max-1000x1000.png"
    "facebook-ads" = "https://cdn.worldvectorlogo.com/logos/facebook-ads.svg"
    "tiktok-ads" = "https://cdn.worldvectorlogo.com/logos/tiktok-1.svg"
    "shopify" = "https://cdn.worldvectorlogo.com/logos/shopify.svg"
    "woocommerce" = "https://cdn.worldvectorlogo.com/logos/woocommerce.svg"
    "salesforce" = "https://cdn.worldvectorlogo.com/logos/salesforce-2.svg"
    "hubspot" = "https://cdn.worldvectorlogo.com/logos/hubspot.svg"
    "mailchimp" = "https://cdn.worldvectorlogo.com/logos/mailchimp.svg"
    "klaviyo" = "https://cdn.worldvectorlogo.com/logos/klaviyo-1.svg"
    "facebook" = "https://cdn.worldvectorlogo.com/logos/facebook-3.svg"
    "instagram" = "https://cdn.worldvectorlogo.com/logos/instagram-2016-5.svg"
    "snowflake" = "https://cdn.worldvectorlogo.com/logos/snowflake.svg"
    "bigquery" = "https://cdn.worldvectorlogo.com/logos/google-bigquery-logo-1.svg"
    "tableau" = "https://cdn.worldvectorlogo.com/logos/tableau-software.svg"
    "looker" = "https://cdn.worldvectorlogo.com/logos/looker.svg"
    "zendesk" = "https://cdn.worldvectorlogo.com/logos/zendesk-1.svg"
    "intercom" = "https://cdn.worldvectorlogo.com/logos/intercom-1.svg"
    "stripe" = "https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
    "paypal" = "https://cdn.worldvectorlogo.com/logos/paypal-2.svg"
    "semrush" = "https://cdn.worldvectorlogo.com/logos/semrush.svg"
    "ahrefs" = "https://cdn.worldvectorlogo.com/logos/ahrefs.svg"
    "marketo" = "https://cdn.worldvectorlogo.com/logos/marketo.svg"
    "pardot" = "https://cdn.worldvectorlogo.com/logos/pardot.svg"
    "jira" = "https://cdn.worldvectorlogo.com/logos/jira-1.svg"
    "asana" = "https://cdn.worldvectorlogo.com/logos/asana-logo.svg"
    "dropbox" = "https://cdn.worldvectorlogo.com/logos/dropbox-1.svg"
    "box" = "https://cdn.worldvectorlogo.com/logos/box-1.svg"
    "slack" = "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg"
    "notion" = "https://cdn.worldvectorlogo.com/logos/notion-logo-1.svg"
}

# Create logos directory if it doesn't exist
$logosDir = "public\logos"
if (-not (Test-Path $logosDir)) {
    New-Item -ItemType Directory -Path $logosDir
}

# Download each logo
foreach ($logo in $logos.GetEnumerator()) {
    $outputPath = Join-Path $logosDir "$($logo.Key).svg"
    Write-Host "Downloading $($logo.Key) logo..."
    try {
        Invoke-WebRequest -Uri $logo.Value -OutFile $outputPath
        Write-Host "Successfully downloaded $($logo.Key) logo"
    }
    catch {
        Write-Host "Failed to download $($logo.Key) logo: $_"
    }
} 