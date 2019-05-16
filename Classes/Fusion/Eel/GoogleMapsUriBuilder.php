<?php
namespace Jonnitto\GoogleMaps\Fusion\Eel;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;


class GoogleMapsUriBuilder implements ProtectedContextAwareInterface {

    /**
     * @Flow\Inject
     * @var \Neos\Flow\Log\SystemLoggerInterface
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
    public function buildStaticMapsUri(string $uri) {
        // https://developers.google.com/maps/documentation/maps-static/get-api-key#dig-sig-key
       $usablePrivateKey = strtr($this->signingSecret, '-_', '+/');
       $privateKeyBytes = base64_decode($usablePrivateKey);

       $uri = parse_url($uri);

       if(array_key_exists('query',$uri) && array_key_exists('path', $uri)){
           $encodedPathAndQueryBytes = base64_decode($uri['path'] . "?" . $uri['query']);

            // compute the hash
            $hash = hash_hmac('sha1', $encodedPathAndQueryBytes, $privateKeyBytes);

            // convert the bytes to string and make url-safe by replacing '+' and '/' characters
            $signature = strtr(base64_encode($hash), '-_', '+/');

            return $uri['scheme'] . "://" . $uri['host'] . $uri['path'] . "?" . $uri['query'] . "&signature=" . $signature;
        }

       $this->systemLogger->log('Error while converting URI for Google static maps.', LOG_WARNING, $uri);
       return 'Static Maps URI Builder error - see log for details.';
    }

    /***
     * @param string $value value to be urlencoded
     * @return mixed encoded value
     */
    public function urlencodeValue(string $value){
        return urlencode($value);
    }

       /**
        * All methods are considered safe, i.e. can be executed from within Eel
        *
        * @param string $methodName
        * @return boolean
        */
    public function allowsCallOfMethod($methodName) {
        return TRUE;
    }
}
