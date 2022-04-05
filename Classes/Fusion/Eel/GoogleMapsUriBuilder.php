<?php

namespace Jonnitto\GoogleMaps\Fusion\Eel;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Log\Utility\LogEnvironment;
use Psr\Log\LoggerInterface;


class GoogleMapsUriBuilder implements ProtectedContextAwareInterface
{

    /**
     * @Flow\Inject
     * @var LoggerInterface
     */
    protected $systemLogger;

    /**
     * @var string
     *  @Flow\InjectConfiguration(path="SigningSecret", package="Jonnitto.GoogleMaps")
     */
    protected $signingSecret;

    /**
     * Create a security hash for a google static maps request
     *
     * @param $uri string
     * @return string
     */
    public function buildStaticMapsUri(string $uri): string
    {
        // https://developers.google.com/maps/documentation/maps-static/get-api-key#dig-sig-key

        // 1. Construct the request URL without the signature, making sure to include your API key in the key parameter. Note that you must URL-encode any non-standard characters.
        $uri = parse_url($uri);

        if (array_key_exists('query', $uri) && array_key_exists('path', $uri)) {

            // 2. Strip off the domain portion of the request, leaving only the path and the query:
            $pathAndQuery = $uri['path'] . "?" . $uri['query'];

            // 3. Retrieve your URL signing secret, which is encoded in a modified Base64 for URLs, and sign the above URL above using the HMAC-SHA1 algorithm.
            // Note: Modified Base64 for URLs replaces the + and / characters of standard Base64 with - and _ respectively, so that these Base64 signatures no longer need to be URL-encoded.
            $usablePrivateKey = str_replace(['-', '_'], ['+', '/'], $this->signingSecret);
            $privateKeyBytes = base64_decode($usablePrivateKey);

            // compute the hash
            $hash = hash_hmac('sha1', $pathAndQuery, $privateKeyBytes, true);

            // 4. Encode the resulting binary signature using the modified Base64 for URLs to convert this signature into something that can be passed within a URL.
            $signature =  str_replace(['+', '/'], ['-', '_'], base64_encode($hash));

            return $uri['scheme'] . "://" . $uri['host'] . $uri['path'] . "?" . $uri['query'] . "&signature=" . $signature;
        }

        $this->systemLogger->warning('Error while converting URI for Google static maps.', LogEnvironment::fromMethodName(__METHOD__));
        return 'Static Maps URI Builder error - see log for details.';
    }

    /**
     * All methods are considered safe, i.e. can be executed from within Eel
     *
     * @param string $methodName
     * @return boolean
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
