<?php
namespace Jonnitto\GoogleMaps\Fusion\Eel;

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;

class GoogleMapsUriBuilder implements ProtectedContextAwareInterface {

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
        $url = parse_url($uri);
        $url_to_sign  = $url['path'] . "?" . $url['query'];

        $encoded_signature = hash_hmac("sha1", $url_to_sign, base64_decode(strtr($this->signingSecret, '-_', '+/')), true);
        $encoded_signature = strtr(base64_encode($encoded_signature), '+/', '-_');

        $original_url = $url['scheme'] . "://" . $url['host'] . $url['path'] . "?" . $url['query'];

        return $original_url."&signature=".$encoded_signature;
    }

    function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    function base64url_decode($data) {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
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
