# encoding: utf-8
$:.push File.expand_path('distr', __FILE__)

Gem::Specification.new do |s|
  s.name        = 'sideshow'
  s.version     = '0.4.2'
  s.platform    = Gem::Platform::RUBY
  s.authors     = ['Alcides Queiroz']
  s.email       = ['alcidesqueiroz@gmail.com']
  s.homepage    = 'http://fortesinformatica.github.io/Sideshow'
  s.summary     = 'An incredible Javascript interactive help Library'
  s.license     = 'Apache 2.0'
  s.description = 'Sideshow is a powerful javascript library which aims to reduce your user''s learning curve by providing a way to create step-by-step interactive helps.'
  s.files         = `git ls-files`.split("\n")
  s.require_paths = ['distr']

  s.add_development_dependency('rake')
  s.add_development_dependency('sass')
  s.add_development_dependency('bundler')
end
