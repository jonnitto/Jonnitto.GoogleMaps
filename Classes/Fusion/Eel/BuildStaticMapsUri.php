<?php
namespace Jonnitto\GoogleMaps\Fusion\Eel;

/*                                                                        *
 * This script is used from the TYPO3 Flow package "Sfi.News".            *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Eel\ProtectedContextAwareInterface;

class BuildStaticMapsUri implements ProtectedContextAwareInterface {

    /**
     * Wrap the incoming string in curly brackets
     *
     * @param $coordinates string
     * @param $zoom string
     * @return string
     */
    public function buildStaticMapsUri($coordinates, $zoom) {
        \Neos\Flow\var_dump($coordinates);
        \Neos\Flow\var_dump($zoom);
        if (!isset($coordinates) || empty($coordinates)) {
            throw new \Neos\Eel\FlowQuery\FlowQueryException('buildStaticMapsUri() needs a map location as first argument', 1553611510);
        } else if (!isset($zoom) || empty($zoom)) {
            throw new \Neos\Eel\FlowQuery\FlowQueryException('buildStaticMapsUri() needs a zoom level as second argument', 1553611518);
        } else {
            return "someuri";
        }
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
