<?php
namespace Jonnitto\GoogleMaps\Tests\Unit;

/*
 * This file is part of the Neos.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Tests\UnitTestCase;
use Jonnitto\GoogleMaps\Fusion\Eel as EelHelpers;

/**
 * Tests the CachingHelper
 */
class GoogleMapsUriBuilderTest extends UnitTestCase
{
    /**
     * Tests the correct generation of a google static maps API uri against a predefined URI tested on https://developers.google.com/maps/documentation/maps-static/get-api-key#dig-sig-key
     *
     * @test
     */
    public function URIBuilderProvidesExpectedResult()
    {
        // expected result according to Google uri builder demo on https://developers.google.com/maps/documentation/maps-static/get-api-key#dig-sig-key with fake signingsecret AAAbbbCCCdddEEEfffGGGhhhiii
        $uri = 'https://maps.googleapis.com/maps/api/staticmap?key=BZadSyC0tJ0tGySCPC3ZUDFFPjV3bECJx2D-Isw&center=48.2003545%2C16.3421546%2C16z&zoom=2&size=640x480&scale=1&maptype=roadmap';
        $expected = "https://maps.googleapis.com/maps/api/staticmap?key=BZadSyC0tJ0tGySCPC3ZUDFFPjV3bECJx2D-Isw&center=48.2003545%2C16.3421546%2C16z&zoom=2&size=640x480&scale=1&maptype=roadmap&signature=g7UKmy3LotcgqVWo_2cjDvTmpjQ=";

        $gmub = $this->getUriBuilderWithMockLogger();

        $this->inject($gmub, 'signingSecret', 'AAAbbbCCCdddEEEfffGGGhhhiii');

        $resultURI = $gmub->buildStaticMapsUri($uri);
        $this->assertEquals($expected, $resultURI);
    }

    /**
     * Tests the generation of google maps static API uri against a wrong input (non-URI)
     *
     * @test
     */
    public function checkForNonURIString()
    {
        $uri = "SomeStringNotAnURI";
        $resultURI = $this->getUriBuilderWithMockLogger()->buildStaticMapsUri($uri);
        $this->assertEquals("Static Maps URI Builder error - see log for details.", $resultURI);

    }

    /**
     * Creates an instance of the Eel Helper including an injected mock logger
     *
     * @return EelHelpers\GoogleMapsUriBuilder URI builder with mocked flow logger
     */
    private function getUriBuilderWithMockLogger(){
        $gmub = new EelHelpers\GoogleMapsUriBuilder();
        $systemLogMock = $this->getMockBuilder("\Neos\Flow\Log\SystemLoggerInterface")->getMockForAbstractClass();
        $this->inject($gmub, 'systemLogger', $systemLogMock);
        return $gmub;
    }
}