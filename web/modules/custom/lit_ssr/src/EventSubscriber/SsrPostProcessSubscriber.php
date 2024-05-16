<?php

declare(strict_types=1);

namespace Drupal\lit_ssr\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * An event subscriber to post-process page markup through SSR.
 */
final class SsrPostProcessSubscriber implements EventSubscriberInterface {

  protected static $ssr_url = 'http://drupal_lit_ssr_ssr:3333';

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    return [
      KernelEvents::RESPONSE => ['onKernelResponse'],
    ];
  }

  /**
   * Kernel response event handler.
   */
  public function onKernelResponse(ResponseEvent $event): void {
    $response = $event->getResponse();
    $url = $event->getRequest()->getUri();
    if ($this->is_valid_ssr_url($url) && $content = $response->getContent()) {
      // Process through SSR.
      $processed = $this->processSsr($content, $url);

      // Update the processed data back into the content.
      $response->setContent($processed);
    }
  }

  protected function is_valid_ssr_url(string $url): bool {
    $path = parse_url($url, PHP_URL_PATH);
    return (is_string($path)
            && !str_starts_with($path, '/admin/')
            && !str_starts_with($path, '/block/')
            && !str_starts_with($path, '/editor/')
            && !str_starts_with($path, '/node/add/')
            && !str_ends_with($path, '.js')
            && !str_ends_with($path, '.css')
           );
  }

  /**
   * Submit HTML for processing through the SSR service.
   *
   * @param string $html
   *   The HTML string to be processed through the SSR service.
   *
   * @return string
   *   The processed HTML or the original markup if unsuccessful.
   */
  protected function processSsr(string $html, string $url): string {
    $client = \Drupal::httpClient();
    $response = $client->request('POST', self::$ssr_url, [
      'body' => $html,
      'headers' => [
        'X-Drupal-Url' => $url,
        'Content-Type' => 'text/html',
        'Accept'     => 'text/html',
      ],
    ]);

    if ($response->getStatusCode() != 200) {
      return $html;
    }
    else {
      return $response->getBody()->getContents();
    }
  }

}
